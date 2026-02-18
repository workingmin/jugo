package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/jugo/backend/config"
)

// Provider AI提供商类型
type Provider string

const (
	ProviderClaude   Provider = "claude"
	ProviderDeepSeek Provider = "deepseek"
)

// Client AI客户端接口
type Client interface {
	Generate(ctx context.Context, prompt string, maxTokens int) (string, error)
	GenerateStream(ctx context.Context, prompt string, maxTokens int, callback func(string)) error
}

// client AI客户端实现
type client struct {
	provider   Provider
	apiKey     string
	model      string
	maxTokens  int
	timeout    int
	httpClient *http.Client
}

// NewClient 创建AI客户端
func NewClient(provider Provider, cfg *config.AIProviderConfig) Client {
	return &client{
		provider:  provider,
		apiKey:    cfg.APIKey,
		model:     cfg.Model,
		maxTokens: cfg.MaxTokens,
		timeout:   cfg.Timeout,
		httpClient: &http.Client{
			Timeout: time.Duration(cfg.Timeout) * time.Second,
		},
	}
}

// Generate 生成文本（非流式）
func (c *client) Generate(ctx context.Context, prompt string, maxTokens int) (string, error) {
	if maxTokens == 0 {
		maxTokens = c.maxTokens
	}

	switch c.provider {
	case ProviderClaude:
		return c.generateClaude(ctx, prompt, maxTokens)
	case ProviderDeepSeek:
		return c.generateDeepSeek(ctx, prompt, maxTokens)
	default:
		return "", fmt.Errorf("unsupported provider: %s", c.provider)
	}
}

// GenerateStream 生成文本（流式）
func (c *client) GenerateStream(ctx context.Context, prompt string, maxTokens int, callback func(string)) error {
	// 流式生成暂时使用非流式实现
	result, err := c.Generate(ctx, prompt, maxTokens)
	if err != nil {
		return err
	}
	callback(result)
	return nil
}

// generateClaude 使用Claude生成文本
func (c *client) generateClaude(ctx context.Context, prompt string, maxTokens int) (string, error) {
	// Claude API请求结构
	reqBody := map[string]interface{}{
		"model": c.model,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"max_tokens": maxTokens,
	}

	return c.makeRequest(ctx, "https://api.anthropic.com/v1/messages", reqBody, "anthropic")
}

// generateDeepSeek 使用DeepSeek生成文本
func (c *client) generateDeepSeek(ctx context.Context, prompt string, maxTokens int) (string, error) {
	// DeepSeek API请求结构（OpenAI兼容）
	reqBody := map[string]interface{}{
		"model": c.model,
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"max_tokens": maxTokens,
	}

	return c.makeRequest(ctx, "https://api.deepseek.com/v1/chat/completions", reqBody, "openai")
}

// makeRequest 发送HTTP请求
func (c *client) makeRequest(ctx context.Context, url string, reqBody map[string]interface{}, apiType string) (string, error) {
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	// 设置请求头
	req.Header.Set("Content-Type", "application/json")
	if apiType == "anthropic" {
		req.Header.Set("x-api-key", c.apiKey)
		req.Header.Set("anthropic-version", "2023-06-01")
	} else {
		req.Header.Set("Authorization", "Bearer "+c.apiKey)
	}

	// 发送请求
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// 读取响应
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	// 解析响应
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("failed to unmarshal response: %w", err)
	}

	// 提取生成的文本
	if apiType == "anthropic" {
		// Claude响应格式
		if content, ok := result["content"].([]interface{}); ok && len(content) > 0 {
			if textBlock, ok := content[0].(map[string]interface{}); ok {
				if text, ok := textBlock["text"].(string); ok {
					return text, nil
				}
			}
		}
	} else {
		// OpenAI兼容格式
		if choices, ok := result["choices"].([]interface{}); ok && len(choices) > 0 {
			if choice, ok := choices[0].(map[string]interface{}); ok {
				if message, ok := choice["message"].(map[string]interface{}); ok {
					if content, ok := message["content"].(string); ok {
						return content, nil
					}
				}
			}
		}
	}

	return "", fmt.Errorf("failed to extract text from response")
}

// SelectProvider 根据任务类型选择AI提供商
func SelectProvider(taskType string) Provider {
	// 高质量任务使用Claude
	highQualityTasks := map[string]bool{
		"outline":           true,
		"polish":            true,
		"consistency_check": true,
		"screenplay_format": true,
	}

	if highQualityTasks[taskType] {
		return ProviderClaude
	}

	// 其他任务使用DeepSeek（成本优先）
	return ProviderDeepSeek
}
