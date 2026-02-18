import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Button,
  Input,
  Select,
  Card,
  Space,
  Collapse,
  Progress,
  message,
  Modal,
  Form,
  Tooltip,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  RobotOutlined,
  FileTextOutlined,
  WarningOutlined,
  VideoCameraOutlined,
  CommentOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { GENRE_TAGS, AI_FUNCTIONS, AUTO_SAVE_INTERVAL } from '../constants';
import './ScreenplayEditor.css';

const { Panel } = Collapse;
const { TextArea } = Input;

// Mock data for scenes
const mockScenes = [
  { id: 'sc1', title: '场景1：咖啡厅-白天-内景', duration: 3 },
  { id: 'sc2', title: '场景2：办公室-白天-内景', duration: 5 },
  { id: 'sc3', title: '场景3：街道-傍晚-外景', duration: 2 },
];

// Mock data for characters
const mockCharacters = [
  { id: 'ch1', name: '李明', appearances: 15 },
  { id: 'ch2', name: '王芳', appearances: 12 },
];

function ScreenplayEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workId = searchParams.get('id');

  // Editor state - 5 input fields matching design
  const [title, setTitle] = useState('都市爱情短剧');
  const [topic, setTopic] = useState('都市女性的职场逆袭与爱情救赎');
  const [genre, setGenre] = useState('都市');
  const [numScenes, setNumScenes] = useState(15);
  const [targetDuration, setTargetDuration] = useState(60);
  const [content, setContent] = useState('场景1：咖啡厅-白天-内景\n\n[镜头：全景，咖啡厅内部，顾客稀少]\n\n角色：李明（男主，28岁，程序员）\n台词：（看着手机，焦虑）她怎么还没来？\n\n动作：李明不停看表，手指敲击桌面');
  const [scenes, setScenes] = useState(mockScenes);
  const [currentSceneId, setCurrentSceneId] = useState('sc1');
  const [currentDuration, setCurrentDuration] = useState(10);
  const [showPreview, setShowPreview] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  // Characters
  const [characters, setCharacters] = useState(mockCharacters);

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoSave();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [content, title]);

  // Duration calculation effect
  useEffect(() => {
    // Simple duration calculation: ~150 words per minute for dialogue
    const wordCount = content.length;
    const estimatedMinutes = Math.ceil(wordCount / 150);
    setCurrentDuration(estimatedMinutes);
  }, [content]);

  const handleAutoSave = useCallback(() => {
    // 模拟保存过程
    setTimeout(() => {
      console.log('Auto-saved:', { title, content });

      // 显示轻量的自动保存提示，5秒后自动消失
      message.success({
        content: '已自动保存',
        duration: 5,
        style: {
          marginTop: '60px', // 避免遮挡工具栏
        },
      });
    }, 500);
  }, [title, content]);

  const handleSave = () => {
    message.loading('保存中...', 1);
    setTimeout(() => {
      message.success('保存成功！');
    }, 1000);
  };

  const handleExport = () => {
    Modal.confirm({
      title: '导出剧本',
      content: (
        <div>
          <p>选择导出格式：</p>
          <Select
            defaultValue="docx"
            style={{ width: '100%' }}
            options={[
              { value: 'docx', label: '标准剧本格式(Word)' },
              { value: 'pdf', label: 'PDF文档' },
              { value: 'fdx', label: 'Final Draft格式' },
            ]}
          />
        </div>
      ),
      onOk: () => {
        message.loading('导出中...', 2);
        setTimeout(() => {
          message.success('导出成功！');
        }, 2000);
      },
    });
  };

  const handleAIFunction = (functionKey) => {
    setAiGenerating(true);
    setAiProgress(0);

    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAiGenerating(false);
          message.success(`${functionKey}完成！`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAddScene = () => {
    Modal.confirm({
      title: '新建场景',
      content: (
        <Form layout="vertical">
          <Form.Item label="场景描述">
            <Input placeholder="例如：咖啡厅-白天-内景" />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        message.success('场景创建成功！');
      },
    });
  };

  const handleConvertToNovel = () => {
    Modal.confirm({
      title: '转换为小说',
      icon: <ThunderboltOutlined style={{ color: '#7C3AED' }} />,
      content: (
        <div>
          <p>将剧本内容转换为小说格式，包括：</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>场景描述扩展</li>
            <li>对话转为叙事</li>
            <li>动作转为描写</li>
            <li>增加心理活动</li>
          </ul>
          <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '13px' }}>
            预计耗时：约 2-3 分钟（根据内容长度）
          </p>
          <p style={{ marginTop: '8px', color: '#6B7280', fontSize: '13px' }}>
            原剧本内容将保留，转换后将创建新的小说作品
          </p>
        </div>
      ),
      okText: '开始转换',
      cancelText: '取消',
      okButtonProps: {
        style: { background: '#7C3AED', borderColor: '#7C3AED' }
      },
      onOk: () => {
        setAiGenerating(true);
        setAiProgress(0);
        message.loading('正在转换为小说...', 0);

        const interval = setInterval(() => {
          setAiProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setAiGenerating(false);
              message.destroy();
              message.success('转换成功！正在跳转到小说编辑器...', 2);

              // 跳转到小说编辑器
              setTimeout(() => {
                navigate(`/editor/novel?id=${workId || 'new'}&from=screenplay`);
              }, 2000);

              return 100;
            }
            return prev + 5;
          });
        }, 100);
      },
    });
  };

  const currentScene = scenes.find(sc => sc.id === currentSceneId);

  // Quill editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote'],
      ['clean']
    ],
  };

  return (
    <div className="screenplay-editor">
      {/* Left Settings Panel */}
      <div className="editor-left-panel">
        <Card size="small" className="panel-card">
          {/* Basic Info */}
          <div className="basic-info-section">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="剧本标题"
              className="title-input"
              bordered={false}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div>
                <div className="label">主题</div>
                <TextArea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="描述剧本的核心主题，如'都市女性的职场逆袭'"
                  rows={2}
                />
              </div>
              <div>
                <div className="label">类型</div>
                <Select
                  value={genre}
                  onChange={setGenre}
                  style={{ width: '100%' }}
                  options={[
                    { value: '都市', label: '都市' },
                    { value: '言情', label: '言情' },
                    { value: '悬疑', label: '悬疑' },
                    { value: '古装', label: '古装' },
                    { value: '玄幻', label: '玄幻' },
                    { value: '喜剧', label: '喜剧' },
                    { value: '家庭', label: '家庭' },
                    { value: '职场', label: '职场' },
                  ]}
                />
              </div>
              <div>
                <div className="label">场景数</div>
                <Input
                  type="number"
                  value={numScenes}
                  onChange={(e) => setNumScenes(Number(e.target.value))}
                  min={8}
                  max={30}
                  addonAfter="场景"
                />
              </div>
              <div>
                <div className="label">目标时长</div>
                <Input
                  type="number"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(Number(e.target.value))}
                  min={30}
                  max={120}
                  addonAfter="分钟"
                />
              </div>
              <div>
                <div className="label">时长统计</div>
                <div className="duration-count">{currentDuration}分钟</div>
              </div>
            </Space>
          </div>

          <Divider />

          {/* Scene Management */}
          <div className="scene-section">
            <div className="section-header">
              <span className="section-title">场景管理</span>
              <Button
                type="link"
                size="small"
                icon={<PlusOutlined />}
                onClick={handleAddScene}
              >
                新建
              </Button>
            </div>
            <div className="scene-list">
              {scenes.map(scene => (
                <div
                  key={scene.id}
                  className={`scene-item ${scene.id === currentSceneId ? 'active' : ''}`}
                  onClick={() => setCurrentSceneId(scene.id)}
                >
                  <div className="scene-title">{scene.title}</div>
                  <div className="scene-duration">{scene.duration}分钟</div>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* Character Management */}
          <div className="character-section">
            <div className="section-header">
              <span className="section-title">角色管理</span>
              <Button
                type="link"
                size="small"
                icon={<PlusOutlined />}
              >
                添加
              </Button>
            </div>
            <div className="character-list">
              {characters.map(character => (
                <div key={character.id} className="character-item">
                  <span className="character-name">{character.name}</span>
                  <span className="character-appearances">出场{character.appearances}次</span>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* AI Assistance */}
          <div className="ai-section">
            <div className="section-title">AI辅助</div>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Button block icon={<VideoCameraOutlined />} onClick={() => handleAIFunction('分镜生成')}>
                分镜生成
              </Button>
              <Button block icon={<CommentOutlined />} onClick={() => handleAIFunction('对话优化')}>
                对话优化
              </Button>
              <Button block icon={<FileTextOutlined />} onClick={() => handleAIFunction('冲突建议')}>
                冲突建议
              </Button>
            </Space>
          </div>
        </Card>
      </div>

      {/* Center Editor Area */}
      <div className="editor-center-panel">
        {/* Toolbar */}
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <Space>
              <Tooltip title="续写对话">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleAIFunction('续写对话')}
                  loading={aiGenerating}
                >
                  续写对话
                </Button>
              </Tooltip>
              <Tooltip title="生成动作">
                <Button
                  icon={<RobotOutlined />}
                  onClick={() => handleAIFunction('生成动作')}
                >
                  生成动作
                </Button>
              </Tooltip>
              <Tooltip title="场景描述">
                <Button onClick={() => handleAIFunction('场景描述')}>场景描述</Button>
              </Tooltip>
            </Space>
          </div>
          <div className="toolbar-right">
            <Space>
              <Button icon={<SaveOutlined />} onClick={handleSave}>
                保存
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
              <Tooltip title="使用 AI 将剧本转换为小说格式">
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  onClick={handleConvertToNovel}
                  style={{ background: '#7C3AED', borderColor: '#7C3AED' }}
                >
                  转为小说
                </Button>
              </Tooltip>
              <Button
                icon={<EyeOutlined />}
                onClick={() => setShowPreview(!showPreview)}
              >
                预览
              </Button>
            </Space>
          </div>
        </div>

        {/* Editor */}
        <div className="editor-main">
          <div className="editor-header">
            <h2>{currentScene?.title}</h2>
          </div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="quill-editor screenplay-format"
            placeholder="开始创作剧本..."
          />
          {aiGenerating && (
            <div className="ai-generating">
              <Progress percent={aiProgress} status="active" />
              <span>AI生成中...{aiProgress}%</span>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="editor-status-bar">
          <span>当前场景: {currentScene?.title}</span>
          <span>预估时长: {currentScene?.duration}分钟</span>
          <span>总时长: {currentDuration}/{targetDuration}分钟</span>
        </div>
      </div>

      {/* Right Preview Panel */}
      {showPreview && (
        <div className="editor-right-panel">
          <Card size="small" title="分镜预览" className="panel-card">
            <div className="storyboard-preview">
              <p>镜头1：全景</p>
              <p>景别：远景</p>
              <p>运动：固定</p>
              <p>时长：3秒</p>
            </div>
          </Card>

          <Card size="small" title="时长统计" className="panel-card" style={{ marginTop: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <span>当前场景: {currentScene?.duration}分钟</span>
              </div>
              <div>
                <span>全剧时长: {currentDuration}分钟</span>
              </div>
              <div>
                <span>目标时长: {targetDuration}分钟</span>
              </div>
              <Progress
                percent={Math.round((currentDuration / targetDuration) * 100)}
                status={currentDuration > targetDuration ? 'exception' : 'active'}
              />
            </Space>
          </Card>

          <Card size="small" title="问题提示" className="panel-card" style={{ marginTop: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="problem-item">
                <WarningOutlined style={{ color: '#F59E0B' }} />
                <span>场景3角色台词过长</span>
              </div>
              <div className="problem-item">
                <WarningOutlined style={{ color: '#F59E0B' }} />
                <span>场景5缺少冲突点</span>
              </div>
            </Space>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ScreenplayEditor;