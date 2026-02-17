import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Select,
  Card,
  Tag,
  Space,
  Row,
  Col,
  Modal,
  Form,
  message,
  Statistic,
  Empty,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  ExportOutlined,
  DeleteOutlined,
  MoreOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  ImportOutlined,
  DeleteFilled,
  DownloadOutlined,
} from '@ant-design/icons';
import { mockWorks, mockUser } from '../data/mockData';
import { WORK_TYPES, WORK_STATUS } from '../constants';
import './Works.css';

const { Search } = Input;

function Works() {
  const navigate = useNavigate();
  const [works, setWorks] = useState(mockWorks);
  const [filteredWorks, setFilteredWorks] = useState(mockWorks);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [searchText, setSearchText] = useState('');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createType, setCreateType] = useState(null);
  const [form] = Form.useForm();

  // Filter and sort works
  useEffect(() => {
    let filtered = [...works];

    // Apply type filter
    if (filterType !== 'all') {
      if (filterType === 'novel') {
        filtered = filtered.filter(w => w.type === WORK_TYPES.NOVEL);
      } else if (filterType === 'screenplay') {
        filtered = filtered.filter(w => w.type === WORK_TYPES.SCREENPLAY);
      } else if (filterType === 'draft') {
        filtered = filtered.filter(w => w.status === WORK_STATUS.DRAFT);
      } else if (filterType === 'completed') {
        filtered = filtered.filter(w => w.status === WORK_STATUS.COMPLETED);
      }
    }

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(w =>
        w.title.toLowerCase().includes(searchText.toLowerCase()) ||
        w.genre.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'updatedAt') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'words') {
        return b.words - a.words;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setFilteredWorks(filtered);
  }, [works, filterType, sortBy, searchText]);

  const handleCreateWork = (type) => {
    setCreateType(type);
    setIsCreateModalVisible(true);
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success(`创建${createType === 'novel' ? '小说' : '剧本'}成功！`);
      setIsCreateModalVisible(false);
      form.resetFields();

      // Navigate to editor
      setTimeout(() => {
        navigate(`/editor/${createType}`);
      }, 500);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEditWork = (work) => {
    const editorType = work.type === WORK_TYPES.NOVEL ? 'novel' : 'screenplay';
    navigate(`/editor/${editorType}?id=${work.id}`);
  };

  const handleExportWork = (work) => {
    message.loading(`正在导出《${work.title}》...`, 2);
    setTimeout(() => {
      message.success('导出成功！');
    }, 2000);
  };

  const handleDeleteWork = (work) => {
    Modal.confirm({
      title: '确认删除',
      content: `确认删除《${work.title}》？删除后可在回收站恢复`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setWorks(works.filter(w => w.id !== work.id));
        message.success('已移入回收站');
      },
    });
  };

  const getWorkActions = (work) => [
    {
      key: 'edit',
      label: '继续编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditWork(work),
    },
    {
      key: 'export',
      label: '导出',
      icon: <ExportOutlined />,
      onClick: () => handleExportWork(work),
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteWork(work),
    },
  ];

  return (
    <div className="works-page">
      {/* Top Operation Area */}
      <div className="works-header">
        <div className="works-header-left">
          <h1 className="works-title">我的作品</h1>
          <span className="works-count">共 {works.length} 部作品</span>
        </div>
        <div className="works-header-right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => handleCreateWork('novel')}
            style={{ marginRight: '12px' }}
          >
            新建小说
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => handleCreateWork('screenplay')}
          >
            新建剧本
          </Button>
        </div>
      </div>

      {/* Filter and Search Area */}
      <div className="works-filter">
        <div className="works-filter-left">
          <Space size="middle">
            <Button
              type={filterType === 'all' ? 'primary' : 'default'}
              onClick={() => setFilterType('all')}
            >
              全部
            </Button>
            <Button
              type={filterType === 'novel' ? 'primary' : 'default'}
              onClick={() => setFilterType('novel')}
            >
              小说
            </Button>
            <Button
              type={filterType === 'screenplay' ? 'primary' : 'default'}
              onClick={() => setFilterType('screenplay')}
            >
              剧本
            </Button>
            <Button
              type={filterType === 'draft' ? 'primary' : 'default'}
              onClick={() => setFilterType('draft')}
            >
              草稿
            </Button>
            <Button
              type={filterType === 'completed' ? 'primary' : 'default'}
              onClick={() => setFilterType('completed')}
            >
              已完成
            </Button>
          </Space>
        </div>
        <div className="works-filter-middle">
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 150 }}
            options={[
              { value: 'updatedAt', label: '最近编辑' },
              { value: 'createdAt', label: '创建时间' },
              { value: 'words', label: '字数' },
              { value: 'title', label: '标题' },
            ]}
          />
        </div>
        <div className="works-filter-right">
          <Search
            placeholder="搜索作品标题或题材"
            allowClear
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <Row gutter={24}>
        {/* Works List */}
        <Col xs={24} xl={18}>
          {filteredWorks.length === 0 ? (
            <Empty
              description="暂无作品"
              style={{ marginTop: '80px' }}
            >
              <Button type="primary" onClick={() => handleCreateWork('novel')}>
                开始你的第一部作品
              </Button>
            </Empty>
          ) : (
            <Row gutter={[16, 16]}>
              {filteredWorks.map(work => (
                <Col xs={24} sm={12} lg={8} key={work.id}>
                  <Card
                    hoverable
                    className="work-card"
                    cover={
                      <div className="work-cover">
                        {work.type === WORK_TYPES.NOVEL ? (
                          <FileTextOutlined style={{ fontSize: '48px' }} />
                        ) : (
                          <VideoCameraOutlined style={{ fontSize: '48px' }} />
                        )}
                      </div>
                    }
                    actions={[
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditWork(work)}
                      >
                        编辑
                      </Button>,
                      <Button
                        type="link"
                        icon={<ExportOutlined />}
                        onClick={() => handleExportWork(work)}
                      >
                        导出
                      </Button>,
                      <Dropdown menu={{ items: getWorkActions(work) }} trigger={['click']}>
                        <Button type="link" icon={<MoreOutlined />} />
                      </Dropdown>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div className="work-card-title" onClick={() => handleEditWork(work)}>
                          {work.title}
                        </div>
                      }
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Space wrap>
                            <Tag color={work.type === WORK_TYPES.NOVEL ? 'blue' : 'purple'}>
                              {work.type === WORK_TYPES.NOVEL ? '小说' : '剧本'}
                            </Tag>
                            <Tag>{work.genre}</Tag>
                            <Tag color={work.status === WORK_STATUS.DRAFT ? 'default' : 'success'}>
                              {work.status === WORK_STATUS.DRAFT ? '草稿' : '已完成'}
                            </Tag>
                          </Space>
                          <div className="work-info">
                            字数：{(work.words / 10000).toFixed(1)}万字
                          </div>
                          <div className="work-info">更新：{work.updatedAt}</div>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* Statistics Panel */}
        <Col xs={24} xl={6}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Statistics Card */}
            <Card title="创作统计" className="stats-card">
              <Statistic
                title="累计作品数"
                value={mockUser.stats.totalWorks}
                suffix="部"
                style={{ marginBottom: '16px' }}
              />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="小说作品"
                    value={mockUser.stats.novelCount}
                    suffix="部"
                    valueStyle={{ fontSize: '20px' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="剧本作品"
                    value={mockUser.stats.screenplayCount}
                    suffix="部"
                    valueStyle={{ fontSize: '20px' }}
                  />
                </Col>
              </Row>
              <Statistic
                title="总字数统计"
                value={(mockUser.stats.totalWords / 10000).toFixed(1)}
                suffix="万字"
                style={{ marginTop: '16px' }}
              />
              <Statistic
                title="本周创作字数"
                value={(mockUser.stats.weeklyWords / 1000).toFixed(1)}
                suffix="千字"
                style={{ marginTop: '16px' }}
              />
            </Card>

            {/* Quick Functions Card */}
            <Card title="快捷功能" className="quick-functions-card">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  block
                  icon={<ImportOutlined />}
                  onClick={() => message.info('导入功能开发中')}
                >
                  导入作品
                </Button>
                <Button
                  block
                  icon={<DeleteFilled />}
                  onClick={() => message.info('回收站功能开发中')}
                >
                  回收站
                </Button>
                <Button
                  block
                  icon={<DownloadOutlined />}
                  onClick={() => message.info('批量导出功能开发中')}
                >
                  导出全部
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Create Work Modal */}
      <Modal
        title={`新建${createType === 'novel' ? '小说' : '剧本'}`}
        open={isCreateModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="作品标题"
            name="title"
            rules={[{ required: true, message: '请输入作品标题' }]}
          >
            <Input placeholder="请输入作品标题" />
          </Form.Item>
          <Form.Item
            label="题材标签"
            name="genre"
            rules={[{ required: true, message: '请选择题材标签' }]}
          >
            <Select
              placeholder="请选择题材标签"
              options={
                createType === 'novel'
                  ? [
                      { value: '都市', label: '都市' },
                      { value: '玄幻', label: '玄幻' },
                      { value: '言情', label: '言情' },
                      { value: '武侠', label: '武侠' },
                      { value: '科幻', label: '科幻' },
                    ]
                  : [
                      { value: '短剧', label: '短剧' },
                      { value: '电影', label: '电影' },
                      { value: '话剧', label: '话剧' },
                      { value: '网剧', label: '网剧' },
                    ]
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Works;
