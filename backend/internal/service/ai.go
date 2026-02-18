package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jugo/backend/config"
	"github.com/jugo/backend/internal/dto"
	"github.com/jugo/backend/internal/model"
	"github.com/jugo/backend/internal/repository"
	"github.com/jugo/backend/pkg/ai"
)

var (
	ErrAITaskNotFound = errors.New("AI task not found")
)

// AIService AI服务接口
type AIService interface {
	Continue(userID uint, req *dto.ContinueRequest) (*dto.AITaskResponse, error)
	Polish(userID uint, req *dto.PolishRequest) (*dto.AITaskResponse, error)
	Expand(userID uint, req *dto.ExpandRequest) (*dto.AITaskResponse, error)
	Rewrite(userID uint, req *dto.RewriteRequest) (*dto.AITaskResponse, error)
	GenerateOutline(userID uint, req *dto.OutlineRequest) (*dto.AITaskResponse, error)
	ConvertNovelToScreenplay(userID uint, req *dto.NovelToScreenplayRequest) (*dto.AITaskResponse, error)
	ConvertScreenplayToNovel(userID uint, req *dto.ScreenplayToNovelRequest) (*dto.AITaskResponse, error)
	GetTaskStatus(userID, taskID uint) (*dto.TaskStatusResponse, error)
}

// aiService AI服务实现
type aiService struct {
	aiTaskRepo     repository.AITaskRepository
	workRepo       repository.WorkRepository
	claudeClient   ai.Client
	deepSeekClient ai.Client
	cfg            *config.Config
}

// NewAIService 创建AI服务
func NewAIService(
	aiTaskRepo repository.AITaskRepository,
	workRepo repository.WorkRepository,
	cfg *config.Config,
) AIService {
	return &aiService{
		aiTaskRepo:     aiTaskRepo,
		workRepo:       workRepo,
		claudeClient:   ai.NewClient(ai.ProviderClaude, &cfg.AI.Claude),
		deepSeekClient: ai.NewClient(ai.ProviderDeepSeek, &cfg.AI.DeepSeek),
		cfg:            cfg,
	}
}

// Continue AI续写
func (s *aiService) Continue(userID uint, req *dto.ContinueRequest) (*dto.AITaskResponse, error) {
	// 验证作品权限
	if err := s.validateWorkOwnership(userID, req.WorkID); err != nil {
		return nil, err
	}

	// 创建任务记录
	params, _ := json.Marshal(req)
	task := &model.AITask{
		UserID:     userID,
		WorkID:     req.WorkID,
		Type:       model.AITaskTypeContinue,
		Status:     model.AITaskStatusPending,
		Parameters: string(params),
		Progress:   0,
	}

	if err := s.aiTaskRepo.Create(task); err != nil {
		return nil, err
	}

	// 异步处理任务
	go s.processContinueTask(task.ID, req)

	return &dto.AITaskResponse{
		TaskID:        task.ID,
		Status:        string(task.Status),
		EstimatedTime: 30,
	}, nil
}

// Polish AI润色
func (s *aiService) Polish(userID uint, req *dto.PolishRequest) (*dto.AITaskResponse, error) {
	// 验证作品权限
	if err := s.validateWorkOwnership(userID, req.WorkID); err != nil {
		return nil, err
	}

	// 创建任务记录
	params, _ := json.Marshal(req)
	task := &model.AITask{
		UserID:     userID,
		WorkID:     req.WorkID,
		Type:       model.AITaskTypePolish,
		Status:     model.AITaskStatusPending,
		Parameters: string(params),
		Progress:   0,
	}

	if err := s.aiTaskRepo.Create(task); err != nil {
		return nil, err
	}

	// 异步处理任务
	go s.processPolishTask(task.ID, req)

	return &dto.AITaskResponse{
		TaskID:        task.ID,
		Status:        string(task.Status),
		EstimatedTime: 20,
	}, nil
}

// Expand AI扩写
func (s *aiService) Expand(userID uint, req *dto.ExpandRequest) (*dto.AITaskResponse, error) {
	// 验证作品权限
	if err := s.validateWorkOwnership(userID, req.WorkID); err != nil {
		return nil, err
	}

	// 创建任务记录
	params, _ := json.Marshal(req)
	task := &model.AITask{
		UserID:     userID,
		WorkID:     req.WorkID,
		Type:       model.AITaskTypeExpand,
		Status:     model.AITaskStatusPending,
		Parameters: string(params),
		Progress:   0,
	}

	if err := s.aiTaskRepo.Create(task); err != nil {
		return nil, err
	}

	// 异步处理任务
	go s.processExpandTask(task.ID, req)

	return &dto.AITaskResponse{
		TaskID:        task.ID,
		Status:        string(task.Status),
		EstimatedTime: 40,
	}, nil
}

// Rewrite AI改写
func (s *aiService) Rewrite(userID uint, req *dto.RewriteRequest) (*dto.AITaskResponse, error) {
	// 验证作品权限
	if err := s.validateWorkOwnership(userID, req.WorkID); err != nil {
		return nil, err
	}

	// 创建任务记录
	params, _ := json.Marshal(req)
	task := &model.AITask{
		UserID:     userID,
		WorkID:     req.WorkID,
		Type:       model.AITaskTypeRewrite,
		Status:     model.AITaskStatusPending,
		Parameters: string(params),
		Progress:   0,
	}

	if err := s.aiTaskRepo.Create(task); err != nil {
		return nil, err
	}

	// 异步处理任务
	go s.processRewriteTask(task.ID, req)

	return &dto.AITaskResponse{
		TaskID:        task.ID,
		Status:        string(task.Status),
		EstimatedTime: 25,
	}, nil
}

// GetTaskStatus 获取任务状态
func (s *aiService) GetTaskStatus(userID, taskID uint) (*dto.TaskStatusResponse, error) {
	task, err := s.aiTaskRepo.FindByID(taskID)
	if err != nil {
		return nil, ErrAITaskNotFound
	}

	// 验证任务所有权
	if task.UserID != userID {
		return nil, ErrUnauthorized
	}

	return &dto.TaskStatusResponse{
		TaskID:      task.ID,
		Status:      string(task.Status),
		Progress:    task.Progress,
		Result:      task.Result,
		Error:       task.Error,
		CreatedAt:   task.CreatedAt,
		CompletedAt: task.CompletedAt,
	}, nil
}

// validateWorkOwnership 验证作品所有权
func (s *aiService) validateWorkOwnership(userID, workID uint) error {
	work, err := s.workRepo.FindByID(workID)
	if err != nil {
		return ErrWorkNotFound
	}
	if work.UserID != userID {
		return ErrUnauthorized
	}
	return nil
}

// processContinueTask 处理续写任务
func (s *aiService) processContinueTask(taskID uint, req *dto.ContinueRequest) {
	ctx := context.Background()

	// 更新任务状态为处理中
	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 10)

	// 构建提示词
	prompt := s.buildContinuePrompt(req)

	// 选择AI客户端（续写使用DeepSeek）
	client := s.deepSeekClient

	// 调用AI生成
	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 30)
	result, err := client.Generate(ctx, prompt, req.Length)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	// 保存结果
	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 90)
	s.aiTaskRepo.UpdateResult(taskID, result)

	// 标记完成
	now := time.Now()
	task, _ := s.aiTaskRepo.FindByID(taskID)
	task.Status = model.AITaskStatusCompleted
	task.Progress = 100
	task.CompletedAt = &now
	s.aiTaskRepo.Update(task)
}

// processPolishTask 处理润色任务
func (s *aiService) processPolishTask(taskID uint, req *dto.PolishRequest) {
	ctx := context.Background()

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 10)

	prompt := s.buildPolishPrompt(req)

	// 润色使用Claude
	client := s.claudeClient

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 30)
	result, err := client.Generate(ctx, prompt, 4096)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 90)
	s.aiTaskRepo.UpdateResult(taskID, result)

	now := time.Now()
	task, _ := s.aiTaskRepo.FindByID(taskID)
	task.Status = model.AITaskStatusCompleted
	task.Progress = 100
	task.CompletedAt = &now
	s.aiTaskRepo.Update(task)
}

// processExpandTask 处理扩写任务
func (s *aiService) processExpandTask(taskID uint, req *dto.ExpandRequest) {
	ctx := context.Background()

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 10)

	prompt := s.buildExpandPrompt(req)

	// 扩写使用DeepSeek
	client := s.deepSeekClient

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 30)
	result, err := client.Generate(ctx, prompt, req.Length)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 90)
	s.aiTaskRepo.UpdateResult(taskID, result)

	now := time.Now()
	task, _ := s.aiTaskRepo.FindByID(taskID)
	task.Status = model.AITaskStatusCompleted
	task.Progress = 100
	task.CompletedAt = &now
	s.aiTaskRepo.Update(task)
}

// processRewriteTask 处理改写任务
func (s *aiService) processRewriteTask(taskID uint, req *dto.RewriteRequest) {
	ctx := context.Background()

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 10)

	prompt := s.buildRewritePrompt(req)

	// 改写使用DeepSeek
	client := s.deepSeekClient

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 30)
	result, err := client.Generate(ctx, prompt, 4096)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 90)
	s.aiTaskRepo.UpdateResult(taskID, result)

	now := time.Now()
	task, _ := s.aiTaskRepo.FindByID(taskID)
	task.Status = model.AITaskStatusCompleted
	task.Progress = 100
	task.CompletedAt = &now
	s.aiTaskRepo.Update(task)
}

// buildContinuePrompt 构建续写提示词
func (s *aiService) buildContinuePrompt(req *dto.ContinueRequest) string {
	styleHint := ""
	if req.Style != "" {
		styleHint = fmt.Sprintf("\n- 风格要求：%s", req.Style)
	}

	typeDesc := "小说"
	if req.Type == "screenplay" {
		typeDesc = "剧本"
	}

	return fmt.Sprintf(`你是一位经验丰富的%s作家。请根据前文内容进行自然流畅的续写。

【前文内容】
%s

【续写要求】
- 续写长度：约%d字
- 保持与前文的风格、语气、人物性格完全一致
- 情节发展自然合理，符合逻辑
- 如果是对话场景，注意对话的真实性和人物特点
- 如果是叙事场景，注意细节描写和氛围营造%s
- 直接输出续写内容，不要添加任何解释说明

【续写内容】`, typeDesc, req.Context, req.Length, styleHint)
}

// buildPolishPrompt 构建润色提示词
func (s *aiService) buildPolishPrompt(req *dto.PolishRequest) string {
	styleHint := ""
	if req.Style != "" {
		styleHint = fmt.Sprintf("\n- 目标风格：%s", req.Style)
	}

	return fmt.Sprintf(`你是一位专业的文字编辑。请对以下内容进行润色优化，提升文字质量和表达效果。

【原文内容】
%s

【润色要求】
- 优化词汇选择，使用更精准、生动的表达
- 改善句式结构，增强语言的节奏感和流畅度
- 消除冗余表达，使文字更加简洁有力
- 保持原文的核心意思和情感基调不变
- 修正可能存在的语法错误或不通顺之处%s
- 直接输出润色后的内容，不要添加任何解释说明

【润色后内容】`, req.Content, styleHint)
}

// buildExpandPrompt 构建扩写提示词
func (s *aiService) buildExpandPrompt(req *dto.ExpandRequest) string {
	focusHint := ""
	if req.Focus != "" {
		focusHint = fmt.Sprintf("\n- 扩写重点：%s", req.Focus)
	}

	return fmt.Sprintf(`你是一位擅长细节描写的作家。请对以下内容进行扩写，丰富细节和描写。

【原文内容】
%s

【扩写要求】
- 扩写后长度：约%d字
- 增加环境描写、人物动作、心理活动等细节
- 丰富感官描写（视觉、听觉、触觉等）
- 保持原有情节主线和人物性格不变
- 扩写内容要自然融入，不显突兀%s
- 直接输出扩写后的完整内容，不要添加任何说明

【扩写后内容】`, req.Content, req.Length, focusHint)
}

// buildRewritePrompt 构建改写提示词
func (s *aiService) buildRewritePrompt(req *dto.RewriteRequest) string {
	hints := ""
	if req.Style != "" {
		hints += fmt.Sprintf("\n- 目标风格：%s", req.Style)
	}
	if req.Tone != "" {
		hints += fmt.Sprintf("\n- 目标语气：%s", req.Tone)
	}

	return fmt.Sprintf(`你是一位文字改写专家。请对以下内容进行改写，改变表达方式但保持核心意思。

【原文内容】
%s

【改写要求】
- 使用不同的词汇和句式结构表达相同的意思
- 可以调整叙述角度或表达顺序
- 保持原文的核心信息和主要观点
- 改写后的文字应该流畅自然，不显生硬%s
- 直接输出改写后的内容，不要添加任何说明

【改写后内容】`, req.Content, hints)
}

// GenerateOutline AI大纲生成
func (s *aiService) GenerateOutline(userID uint, req *dto.OutlineRequest) (*dto.AITaskResponse, error) {
	// 验证作品权限
	if err := s.validateWorkOwnership(userID, req.WorkID); err != nil {
		return nil, err
	}

	// 创建任务记录
	params, _ := json.Marshal(req)
	task := &model.AITask{
		UserID:     userID,
		WorkID:     req.WorkID,
		Type:       model.AITaskTypeOutline,
		Status:     model.AITaskStatusPending,
		Parameters: string(params),
		Progress:   0,
	}

	if err := s.aiTaskRepo.Create(task); err != nil {
		return nil, err
	}

	// 异步处理任务
	go s.processOutlineTask(task.ID, req)

	return &dto.AITaskResponse{
		TaskID:        task.ID,
		Status:        string(task.Status),
		EstimatedTime: 60,
	}, nil
}

// ConvertNovelToScreenplay 小说转剧本
func (s *aiService) ConvertNovelToScreenplay(userID uint, req *dto.NovelToScreenplayRequest) (*dto.AITaskResponse, error) {
	// 验证作品权限
	if err := s.validateWorkOwnership(userID, req.WorkID); err != nil {
		return nil, err
	}

	// 验证作品类型必须是小说
	work, err := s.workRepo.FindByID(req.WorkID)
	if err != nil {
		return nil, ErrWorkNotFound
	}
	if work.Type != "novel" {
		return nil, errors.New("work type must be novel")
	}

	// 创建任务记录
	params, _ := json.Marshal(req)
	task := &model.AITask{
		UserID:     userID,
		WorkID:     req.WorkID,
		Type:       model.AITaskTypeNovelToScreenplay,
		Status:     model.AITaskStatusPending,
		Parameters: string(params),
		Progress:   0,
	}

	if err := s.aiTaskRepo.Create(task); err != nil {
		return nil, err
	}

	// 异步处理任务
	go s.processNovelToScreenplayTask(task.ID, req)

	return &dto.AITaskResponse{
		TaskID:        task.ID,
		Status:        string(task.Status),
		EstimatedTime: 120,
	}, nil
}

// ConvertScreenplayToNovel 剧本转小说
func (s *aiService) ConvertScreenplayToNovel(userID uint, req *dto.ScreenplayToNovelRequest) (*dto.AITaskResponse, error) {
	// 验证作品权限
	if err := s.validateWorkOwnership(userID, req.WorkID); err != nil {
		return nil, err
	}

	// 验证作品类型必须是剧本
	work, err := s.workRepo.FindByID(req.WorkID)
	if err != nil {
		return nil, ErrWorkNotFound
	}
	if work.Type != "screenplay" {
		return nil, errors.New("work type must be screenplay")
	}

	// 创建任务记录
	params, _ := json.Marshal(req)
	task := &model.AITask{
		UserID:     userID,
		WorkID:     req.WorkID,
		Type:       model.AITaskTypeScreenplayToNovel,
		Status:     model.AITaskStatusPending,
		Parameters: string(params),
		Progress:   0,
	}

	if err := s.aiTaskRepo.Create(task); err != nil {
		return nil, err
	}

	// 异步处理任务
	go s.processScreenplayToNovelTask(task.ID, req)

	return &dto.AITaskResponse{
		TaskID:        task.ID,
		Status:        string(task.Status),
		EstimatedTime: 120,
	}, nil
}

// processOutlineTask 处理大纲生成任务
func (s *aiService) processOutlineTask(taskID uint, req *dto.OutlineRequest) {
	ctx := context.Background()

	// 更新任务状态为处理中
	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 10)

	// 构建提示词
	prompt := s.buildOutlinePrompt(req)

	// 大纲生成使用Claude（需要高质量和结构化能力）
	client := s.claudeClient

	// 调用AI生成
	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 30)
	result, err := client.Generate(ctx, prompt, 4096)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	// 保存结果
	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 90)
	s.aiTaskRepo.UpdateResult(taskID, result)

	// 标记完成
	now := time.Now()
	task, _ := s.aiTaskRepo.FindByID(taskID)
	task.Status = model.AITaskStatusCompleted
	task.Progress = 100
	task.CompletedAt = &now
	s.aiTaskRepo.Update(task)
}

// processNovelToScreenplayTask 处理小说转剧本任务
func (s *aiService) processNovelToScreenplayTask(taskID uint, req *dto.NovelToScreenplayRequest) {
	ctx := context.Background()

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 10)

	// 获取作品内容（这里需要获取所有章节内容）
	// TODO: 实现获取完整作品内容的逻辑
	work, err := s.workRepo.FindByID(req.WorkID)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	// 构建提示词
	prompt := s.buildNovelToScreenplayPrompt(work, req)

	// 格式转换使用Claude（需要精确控制）
	client := s.claudeClient

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 30)
	result, err := client.Generate(ctx, prompt, 8192)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 90)
	s.aiTaskRepo.UpdateResult(taskID, result)

	now := time.Now()
	task, _ := s.aiTaskRepo.FindByID(taskID)
	task.Status = model.AITaskStatusCompleted
	task.Progress = 100
	task.CompletedAt = &now
	s.aiTaskRepo.Update(task)
}

// processScreenplayToNovelTask 处理剧本转小说任务
func (s *aiService) processScreenplayToNovelTask(taskID uint, req *dto.ScreenplayToNovelRequest) {
	ctx := context.Background()

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 10)

	// 获取作品内容
	work, err := s.workRepo.FindByID(req.WorkID)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	// 构建提示词
	prompt := s.buildScreenplayToNovelPrompt(work, req)

	// 格式转换使用Claude
	client := s.claudeClient

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 30)
	result, err := client.Generate(ctx, prompt, 8192)
	if err != nil {
		s.aiTaskRepo.UpdateError(taskID, err.Error())
		return
	}

	s.aiTaskRepo.UpdateStatus(taskID, model.AITaskStatusProcessing, 90)
	s.aiTaskRepo.UpdateResult(taskID, result)

	now := time.Now()
	task, _ := s.aiTaskRepo.FindByID(taskID)
	task.Status = model.AITaskStatusCompleted
	task.Progress = 100
	task.CompletedAt = &now
	s.aiTaskRepo.Update(task)
}

// buildOutlinePrompt 构建大纲生成提示词
func (s *aiService) buildOutlinePrompt(req *dto.OutlineRequest) string {
	styleHint := ""
	if req.Style != "" {
		styleHint = fmt.Sprintf("，风格要求：%s", req.Style)
	}

	return fmt.Sprintf(`你是一位专业的%s小说策划师。请根据以下信息生成一个详细的小说大纲%s。

主题：%s
章节数量：%d章

要求：
1. 生成完整的故事梗概（200-300字）
2. 为每一章生成标题和内容概要（每章100-150字）
3. 设定2-3个主要角色及其基本信息
4. 标注3-5个关键情节点
5. 确保情节连贯、逻辑合理
6. 输出格式为结构化的文本，便于阅读

请开始生成大纲：`, req.Genre, styleHint, req.Topic, req.NumChapters)
}

// buildNovelToScreenplayPrompt 构建小说转剧本提示词
func (s *aiService) buildNovelToScreenplayPrompt(work *model.Work, req *dto.NovelToScreenplayRequest) string {
	durationHint := ""
	if req.TargetDuration > 0 {
		durationHint = fmt.Sprintf("，目标时长约%d分钟", req.TargetDuration)
	}
	scenesHint := ""
	if req.NumScenes > 0 {
		scenesHint = fmt.Sprintf("，分为约%d个场景", req.NumScenes)
	}

	return fmt.Sprintf(`你是一位专业的编剧。请将以下小说内容转换为剧本格式%s%s。

小说标题：%s
小说内容：
（注：实际使用时需要加载完整章节内容）

剧本格式要求：
1. 场景标题格式：INT./EXT. 地点 - 时间
2. 场景描述：简洁的环境和氛围描写
3. 人物对话格式：
   角色名
   （表情/动作）
   对话内容
4. 动作描述：用现在时描述人物动作
5. 保留原作核心情节和人物性格
6. 适当调整叙事节奏以适应视觉呈现

请开始转换：`, durationHint, scenesHint, work.Title)
}

// buildScreenplayToNovelPrompt 构建剧本转小说提示词
func (s *aiService) buildScreenplayToNovelPrompt(work *model.Work, req *dto.ScreenplayToNovelRequest) string {
	chaptersHint := ""
	if req.NumChapters > 0 {
		chaptersHint = fmt.Sprintf("，分为%d章", req.NumChapters)
	}
	wordsHint := ""
	if req.WordPerChapter > 0 {
		wordsHint = fmt.Sprintf("，每章约%d字", req.WordPerChapter)
	}

	return fmt.Sprintf(`你是一位专业的小说作家。请将以下剧本内容转换为小说格式%s%s。

剧本标题：%s
剧本内容：
（注：实际使用时需要加载完整章节内容）

小说格式要求：
1. 将场景描述转换为生动的环境描写
2. 将对话转换为小说对话格式，添加对话标签和动作描写
3. 增加人物心理描写和内心独白
4. 丰富细节描写，增强画面感
5. 保持原作情节和人物性格
6. 使用第三人称叙事（或根据原作风格调整）
7. 注意章节划分的合理性

请开始转换：`, chaptersHint, wordsHint, work.Title)
}
