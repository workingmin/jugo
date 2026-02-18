import { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Button,
  Input,
  Select,
  Space,
  Empty,
  Spin,
  Pagination,
  message,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import WorkCard from '@/components/Common/WorkCard'
import CreateWorkModal from './CreateWorkModal'
import { getWorks } from '@/api/works'
import type { Work, WorksQueryParams } from '@/types/work'
import { WORK_TYPES, WORK_STATUS } from '@/config/constants'
import './Works.scss'

const { Search } = Input

const Works = () => {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [createModalVisible, setCreateModalVisible] = useState(false)

  // 查询参数
  const [queryParams, setQueryParams] = useState<WorksQueryParams>({
    type: 'all',
    status: 'all',
    page: 1,
    limit: 12,
    sort: 'updatedAt',
    search: '',
  })

  // 加载作品列表
  const loadWorks = async () => {
    try {
      setLoading(true)
      const response = await getWorks(queryParams)
      setWorks(response.works)
      setTotal(response.pagination.total)
    } catch (error: any) {
      message.error(error.message || '加载作品列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和参数变化时重新加载
  useEffect(() => {
    loadWorks()
  }, [queryParams])

  // 处理筛选变化
  const handleFilterChange = (key: keyof WorksQueryParams, value: any) => {
    setQueryParams((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }

  // 处理搜索
  const handleSearch = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }))
  }

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page,
      limit: pageSize,
    }))
  }

  // 处理作品删除
  const handleWorkDelete = (workId: string) => {
    setWorks((prev) => prev.filter((work) => work.workId !== workId))
    setTotal((prev) => prev - 1)
  }

  // 处理创建成功
  const handleCreateSuccess = () => {
    setCreateModalVisible(false)
    loadWorks()
  }

  return (
    <div className="works-page">
      {/* 顶部筛选栏 */}
      <div className="works-header">
        <Space size="middle" wrap>
          <Select
            value={queryParams.type}
            onChange={(value) => handleFilterChange('type', value)}
            style={{ width: 120 }}
          >
            <Select.Option value="all">全部类型</Select.Option>
            <Select.Option value={WORK_TYPES.NOVEL}>小说</Select.Option>
            <Select.Option value={WORK_TYPES.SCREENPLAY}>剧本</Select.Option>
          </Select>

          <Select
            value={queryParams.status}
            onChange={(value) => handleFilterChange('status', value)}
            style={{ width: 120 }}
          >
            <Select.Option value="all">全部状态</Select.Option>
            <Select.Option value={WORK_STATUS.DRAFT}>草稿</Select.Option>
            <Select.Option value={WORK_STATUS.COMPLETED}>已完成</Select.Option>
            <Select.Option value={WORK_STATUS.PUBLISHED}>已发布</Select.Option>
          </Select>

          <Select
            value={queryParams.sort}
            onChange={(value) => handleFilterChange('sort', value)}
            style={{ width: 120 }}
          >
            <Select.Option value="updatedAt">最近更新</Select.Option>
            <Select.Option value="createdAt">创建时间</Select.Option>
            <Select.Option value="words">字数</Select.Option>
            <Select.Option value="title">标题</Select.Option>
          </Select>

          <Search
            placeholder="搜索作品标题"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setCreateModalVisible(true)}
        >
          新建作品
        </Button>
      </div>

      {/* 作品列表 */}
      <Spin spinning={loading}>
        {works.length === 0 && !loading ? (
          <Empty
            description="暂无作品"
            style={{ marginTop: 60 }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              创建第一个作品
            </Button>
          </Empty>
        ) : (
          <>
            <Row gutter={[24, 24]} className="works-list">
              {works.map((work) => (
                <Col xs={24} sm={12} md={8} lg={6} key={work.workId}>
                  <WorkCard
                    work={work}
                    onDelete={handleWorkDelete}
                    onUpdate={loadWorks}
                  />
                </Col>
              ))}
            </Row>

            {total > 0 && (
              <div className="works-pagination">
                <Pagination
                  current={queryParams.page}
                  pageSize={queryParams.limit}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showTotal={(total) => `共 ${total} 个作品`}
                  pageSizeOptions={['12', '24', '48']}
                />
              </div>
            )}
          </>
        )}
      </Spin>

      <CreateWorkModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}

export default Works
