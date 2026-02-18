import React, { useState } from 'react'
import { List, Button, Modal, Form, Input, Select, message, Dropdown, Space, Tag } from 'antd'
import type { MenuProps } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import { useScreenplayStore } from '@/store/screenplayStore'
import type { Scene, SceneTime, SceneType } from '@/types/screenplay'
import './SceneList.scss'

const { Option } = Select

const SceneList: React.FC = () => {
  const {
    scenes,
    currentSceneId,
    currentWorkId,
    loadScene,
    createScene,
    deleteScene
  } = useScreenplayStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  // 处理场景选择
  const handleSelectScene = (sceneId: string) => {
    if (currentWorkId) {
      loadScene(currentWorkId, sceneId)
    }
  }

  // 创建新场景
  const handleCreateScene = async () => {
    try {
      const values = await form.validateFields()

      if (!currentWorkId) {
        message.error('未找到当前作品')
        return
      }

      const scene = await createScene({
        workId: currentWorkId,
        location: values.location,
        time: values.time,
        type: values.type,
        order: scenes.length + 1
      })

      if (scene) {
        setIsModalOpen(false)
        form.resetFields()
        // 自动打开新创建的场景
        loadScene(currentWorkId, scene.sceneId)
      }
    } catch (error) {
      // Form validation failed
    }
  }

  // 删除场景
  const handleDeleteScene = (sceneId: string) => {
    if (!currentWorkId) return

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个场景吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => deleteScene(currentWorkId, sceneId)
    })
  }

  // 场景菜单
  const getSceneMenu = (scene: Scene): MenuProps => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: '编辑'
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: '删除',
        danger: true,
        onClick: () => handleDeleteScene(scene.sceneId)
      }
    ]
  })

  // 获取场景类型标签
  const getSceneTypeTag = (scene: Scene) => {
    const typeText = scene.type === 'interior' ? '内景' : '外景'
    const timeMap: Record<SceneTime, string> = {
      day: '白天',
      night: '夜晚',
      dawn: '黎明',
      dusk: '黄昏',
      continuous: '连续'
    }
    return (
      <Space size={4}>
        <Tag color={scene.type === 'interior' ? 'blue' : 'green'}>{typeText}</Tag>
        <Tag>{timeMap[scene.time]}</Tag>
      </Space>
    )
  }

  return (
    <div className="scene-list">
      <div className="scene-list-header">
        <h4>场景列表</h4>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          新建场景
        </Button>
      </div>

      <List
        dataSource={scenes}
        renderItem={scene => (
          <List.Item
            className={`scene-item ${currentSceneId === scene.sceneId ? 'active' : ''}`}
            onClick={() => handleSelectScene(scene.sceneId)}
          >
            <div className="scene-content">
              <div className="scene-header">
                <span className="scene-number">场景 {scene.sceneNumber}</span>
                <Dropdown menu={getSceneMenu(scene)} trigger={['click']}>
                  <Button
                    type="text"
                    size="small"
                    icon={<MoreOutlined />}
                    onClick={e => e.stopPropagation()}
                  />
                </Dropdown>
              </div>
              <div className="scene-location">
                <EnvironmentOutlined /> {scene.location}
              </div>
              <div className="scene-meta">
                {getSceneTypeTag(scene)}
                <span className="scene-duration">{scene.duration}分钟</span>
              </div>
            </div>
          </List.Item>
        )}
      />

      <Modal
        title="新建场景"
        open={isModalOpen}
        onOk={handleCreateScene}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="location"
            label="场景地点"
            rules={[{ required: true, message: '请输入场景地点' }]}
          >
            <Input placeholder="例如：咖啡厅、办公室、公园" />
          </Form.Item>

          <Form.Item
            name="type"
            label="场景类型"
            initialValue="interior"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="interior">内景</Option>
              <Option value="exterior">外景</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="time"
            label="时间"
            initialValue="day"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="day">白天</Option>
              <Option value="night">夜晚</Option>
              <Option value="dawn">黎明</Option>
              <Option value="dusk">黄昏</Option>
              <Option value="continuous">连续</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SceneList