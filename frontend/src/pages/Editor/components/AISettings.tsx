import React, { useState } from 'react'
import { Form, Select, Slider, Input, Card } from 'antd'
import type { AISettings as AISettingsType } from '@/types/editor'
import './AISettings.scss'

const { Option } = Select
const { TextArea } = Input

const AISettings: React.FC = () => {
  const [settings, setSettings] = useState<AISettingsType>({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    style: '流畅自然',
    tone: '中性'
  })

  const handleChange = (field: keyof AISettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="ai-settings">
      <Card size="small" title="AI 创作设置">
        <Form layout="vertical" size="small">
          <Form.Item label="AI 模型">
            <Select
              value={settings.model}
              onChange={value => handleChange('model', value)}
            >
              <Option value="gpt-4">GPT-4</Option>
              <Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Option>
              <Option value="claude-3">Claude 3</Option>
            </Select>
          </Form.Item>

          <Form.Item label={`创作温度: ${settings.temperature}`}>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={settings.temperature}
              onChange={value => handleChange('temperature', value)}
              marks={{
                0: '保守',
                0.5: '平衡',
                1: '创新'
              }}
            />
          </Form.Item>

          <Form.Item label="最大生成长度">
            <Slider
              min={500}
              max={4000}
              step={100}
              value={settings.maxTokens}
              onChange={value => handleChange('maxTokens', value)}
            />
            <div className="slider-value">{settings.maxTokens} tokens</div>
          </Form.Item>

          <Form.Item label="写作风格">
            <Select
              value={settings.style}
              onChange={value => handleChange('style', value)}
            >
              <Option value="流畅自然">流畅自然</Option>
              <Option value="简洁明快">简洁明快</Option>
              <Option value="细腻描写">细腻描写</Option>
              <Option value="紧张刺激">紧张刺激</Option>
            </Select>
          </Form.Item>

          <Form.Item label="语气">
            <Select
              value={settings.tone}
              onChange={value => handleChange('tone', value)}
            >
              <Option value="中性">中性</Option>
              <Option value="轻松幽默">轻松幽默</Option>
              <Option value="严肃正式">严肃正式</Option>
              <Option value="温暖感性">温暖感性</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AISettings