import { useState } from 'react'
import { Modal, Form, Input, Select, InputNumber, Radio, message } from 'antd'
import { BookOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { createWork } from '@/api/works'
import type { CreateWorkRequest, WorkType } from '@/types/work'
import { WORK_TYPES, GENRES, EDITOR_CONFIG } from '@/config/constants'
import { createRules } from '@/utils/validation'
import { useNavigate } from 'react-router-dom'

interface CreateWorkModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
}

const CreateWorkModal = ({ visible, onCancel, onSuccess }: CreateWorkModalProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [workType, setWorkType] = useState<WorkType>(WORK_TYPES.NOVEL)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const data: CreateWorkRequest = {
        type: values.type,
        title: values.title,
        topic: values.topic,
        genre: values.genre,
      }

      // 根据类型添加特定字段
      if (values.type === WORK_TYPES.NOVEL) {
        data.numChapters = values.numChapters
        data.wordPerChapter = values.wordPerChapter
      } else {
        data.numScenes = values.numScenes
        data.targetDuration = values.targetDuration
      }

      const work = await createWork(data)
      message.success('作品创建成功')

      // 跳转到编辑器
      const editorPath = work.type === 'novel' ? '/editor/novel' : '/editor/screenplay'
      navigate(`${editorPath}?workId=${work.workId}`)

      onSuccess()
      form.resetFields()
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return
      }
      message.error(error.message || '创建作品失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const handleTypeChange = (value: WorkType) => {
    setWorkType(value)
  }

  return (
    <Modal
      title="创建新作品"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="创建并开始编辑"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: WORK_TYPES.NOVEL,
          genre: '都市',
          numChapters: 20,
          wordPerChapter: EDITOR_CONFIG.DEFAULT_WORDS_PER_CHAPTER,
          numScenes: 15,
          targetDuration: 60,
        }}
      >
        <Form.Item
          name="type"
          label="作品类型"
          rules={[createRules.required('请选择作品类型')]}
        >
          <Radio.Group onChange={(e) => handleTypeChange(e.target.value)} size="large">
            <Radio.Button value={WORK_TYPES.NOVEL}>
              <BookOutlined /> 小说
            </Radio.Button>
            <Radio.Button value={WORK_TYPES.SCREENPLAY}>
              <VideoCameraOutlined /> 剧本
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="title"
          label="作品标题"
          rules={[
            createRules.required('请输入作品标题'),
            createRules.length(1, 100, '标题长度应在1-100字之间'),
          ]}
        >
          <Input placeholder="请输入作品标题" size="large" />
        </Form.Item>

        <Form.Item
          name="topic"
          label="作品主题"
          tooltip="简要描述作品的核心内容或故事梗概"
        >
          <Input.TextArea
            placeholder="例如：一个普通程序员意外获得修仙系统..."
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="genre"
          label="题材类型"
          rules={[createRules.required('请选择题材类型')]}
        >
          <Select placeholder="请选择题材" size="large">
            {GENRES.map((genre) => (
              <Select.Option key={genre} value={genre}>
                {genre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {workType === WORK_TYPES.NOVEL ? (
          <>
            <Form.Item
              name="numChapters"
              label="计划章节数"
              rules={[
                createRules.required('请输入章节数'),
                createRules.numberRange(
                  EDITOR_CONFIG.MIN_CHAPTERS,
                  EDITOR_CONFIG.MAX_CHAPTERS,
                  `章节数应在${EDITOR_CONFIG.MIN_CHAPTERS}-${EDITOR_CONFIG.MAX_CHAPTERS}之间`
                ),
              ]}
            >
              <InputNumber
                min={EDITOR_CONFIG.MIN_CHAPTERS}
                max={EDITOR_CONFIG.MAX_CHAPTERS}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="wordPerChapter"
              label="每章字数"
              rules={[
                createRules.required('请输入每章字数'),
                createRules.numberRange(
                  EDITOR_CONFIG.MIN_WORDS_PER_CHAPTER,
                  EDITOR_CONFIG.MAX_WORDS_PER_CHAPTER,
                  `每章字数应在${EDITOR_CONFIG.MIN_WORDS_PER_CHAPTER}-${EDITOR_CONFIG.MAX_WORDS_PER_CHAPTER}之间`
                ),
              ]}
            >
              <InputNumber
                min={EDITOR_CONFIG.MIN_WORDS_PER_CHAPTER}
                max={EDITOR_CONFIG.MAX_WORDS_PER_CHAPTER}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name="numScenes"
              label="计划场景数"
              rules={[createRules.required('请输入场景数')]}
            >
              <InputNumber
                min={1}
                max={200}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="targetDuration"
              label="目标时长（分钟）"
              rules={[createRules.required('请输入目标时长')]}
            >
              <InputNumber
                min={1}
                max={300}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default CreateWorkModal
