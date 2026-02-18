import React, { useState } from 'react'
import { List, Button, Modal, Form, Input, Tag, message, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useScreenplayStore } from '@/store/screenplayStore'
import type { Character } from '@/types/screenplay'
import './CharacterList.scss'

const { TextArea } = Input

const CharacterList: React.FC = () => {
  const {
    characters,
    currentWorkId,
    createCharacter,
    deleteCharacter
  } = useScreenplayStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  // 创建新角色
  const handleCreateCharacter = async () => {
    try {
      const values = await form.validateFields()

      if (!currentWorkId) {
        message.error('未找到当前作品')
        return
      }

      const character = await createCharacter({
        workId: currentWorkId,
        name: values.name,
        description: values.description || '',
        traits: []
      })

      if (character) {
        setIsModalOpen(false)
        form.resetFields()
      }
    } catch (error) {
      // Form validation failed
    }
  }

  // 删除角色
  const handleDeleteCharacter = (characterId: string) => {
    if (!currentWorkId) return

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个角色吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => deleteCharacter(currentWorkId, characterId)
    })
  }

  // 角色菜单
  const getCharacterMenu = (character: Character): MenuProps => ({
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
        onClick: () => handleDeleteCharacter(character.characterId)
      }
    ]
  })

  return (
    <div className="character-list">
      <div className="character-list-header">
        <h4>角色列表</h4>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          新建角色
        </Button>
      </div>

      <List
        dataSource={characters}
        renderItem={character => (
          <List.Item className="character-item">
            <div className="character-content">
              <div className="character-header">
                <span className="character-name">
                  <UserOutlined /> {character.name}
                </span>
                <Dropdown menu={getCharacterMenu(character)} trigger={['click']}>
                  <Button
                    type="text"
                    size="small"
                    icon={<MoreOutlined />}
                  />
                </Dropdown>
              </div>
              {character.description && (
                <div className="character-description">{character.description}</div>
              )}
              <div className="character-meta">
                <Tag>出场 {character.appearanceCount} 次</Tag>
              </div>
            </div>
          </List.Item>
        )}
      />

      <Modal
        title="新建角色"
        open={isModalOpen}
        onOk={handleCreateCharacter}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名"
            rules={[{ required: true, message: '请输入角色名' }]}
          >
            <Input placeholder="例如：张三、李四" />
          </Form.Item>

          <Form.Item
            name="description"
            label="角色描述"
          >
            <TextArea
              rows={4}
              placeholder="描述角色的外貌、性格、背景等"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CharacterList