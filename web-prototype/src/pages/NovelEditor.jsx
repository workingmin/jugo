import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Button,
  Input,
  Select,
  Card,
  Tree,
  Space,
  Collapse,
  Tag,
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
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  BulbOutlined,
  RobotOutlined,
  FileTextOutlined,
  WarningOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { mockChapters, mockCharacters } from '../data/mockData';
import { GENRE_TAGS, STYLE_TAGS, AI_FUNCTIONS, AUTO_SAVE_INTERVAL } from '../constants';
import './NovelEditor.css';

const { Panel } = Collapse;
const { TextArea } = Input;

function NovelEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workId = searchParams.get('id');

  // Editor state
  const [title, setTitle] = useState('都市修仙传');
  const [topic, setTopic] = useState('一个普通程序员意外获得修仙系统，在都市中开启修仙之路');
  const [genre, setGenre] = useState('都市');
  const [numChapters, setNumChapters] = useState(20);
  const [wordPerChapter, setWordPerChapter] = useState(1500);
  const [content, setContent] = useState('<p>清晨的阳光透过窗帘洒进房间，李明睁开眼睛，发现眼前出现了一个半透明的界面...</p>');
  const [chapters, setChapters] = useState(mockChapters);
  const [currentChapterId, setCurrentChapterId] = useState('ch1');
  const [wordCount, setWordCount] = useState(3200);
  const [showPreview, setShowPreview] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  // Characters
  const [characters, setCharacters] = useState(mockCharacters);

  // Snowflake method
  const [snowflakeData, setSnowflakeData] = useState({
    step1: '一个普通程序员意外获得修仙系统，在都市中开启修仙之路',
    step2: '',
    step3: [],
    step4: false,
  });

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoSave();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [content, title]);

  // Word count effect
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, '');
    setWordCount(text.length);
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
      title: '导出作品',
      content: (
        <div>
          <p>选择导出格式：</p>
          <Select
            defaultValue="docx"
            style={{ width: '100%' }}
            options={[
              { value: 'txt', label: 'TXT文本' },
              { value: 'docx', label: 'Word文档' },
              { value: 'pdf', label: 'PDF文档' },
              { value: 'epub', label: 'EPUB电子书' },
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
          message.success(`${AI_FUNCTIONS[functionKey.toUpperCase()].label}完成！`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAddChapter = () => {
    Modal.confirm({
      title: '新建章节',
      content: (
        <Form layout="vertical">
          <Form.Item label="章节标题">
            <Input placeholder="请输入章节标题" />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        message.success('章节创建成功！');
      },
    });
  };

  const handleConvertToScreenplay = () => {
    Modal.confirm({
      title: '转换为剧本',
      icon: <ThunderboltOutlined style={{ color: '#7C3AED' }} />,
      content: (
        <div>
          <p>将小说内容转换为剧本格式，包括：</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>自动划分场景</li>
            <li>提取角色对话</li>
            <li>生成动作描述</li>
            <li>添加镜头建议</li>
          </ul>
          <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '13px' }}>
            预计耗时：约 2-3 分钟（根据内容长度）
          </p>
          <p style={{ marginTop: '8px', color: '#6B7280', fontSize: '13px' }}>
            原小说内容将保留，转换后将创建新的剧本作品
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
        message.loading('正在转换为剧本...', 0);

        const interval = setInterval(() => {
          setAiProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setAiGenerating(false);
              message.destroy();
              message.success('转换成功！正在跳转到剧本编辑器...', 2);

              // 跳转到剧本编辑器
              setTimeout(() => {
                navigate(`/editor/screenplay?id=${workId || 'new'}&from=novel`);
              }, 2000);

              return 100;
            }
            return prev + 5;
          });
        }, 100);
      },
    });
  };

  const currentChapter = chapters.find(ch => ch.id === currentChapterId);

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
    <div className="novel-editor">
      {/* Left Settings Panel */}
      <div className="editor-left-panel">
        <Card size="small" className="panel-card">
          {/* Basic Info */}
          <div className="basic-info-section">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="作品标题"
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
                  placeholder="描述小说的核心主题，如'复仇与救赎'"
                  rows={2}
                />
              </div>
              <div>
                <div className="label">类型</div>
                <Select
                  value={genre}
                  onChange={setGenre}
                  style={{ width: '100%' }}
                  options={GENRE_TAGS.NOVEL.map(g => ({ value: g, label: g }))}
                />
              </div>
              <div>
                <div className="label">章节数</div>
                <Input
                  type="number"
                  value={numChapters}
                  onChange={(e) => setNumChapters(Number(e.target.value))}
                  min={10}
                  max={50}
                  addonAfter="章"
                />
              </div>
              <div>
                <div className="label">单章字数</div>
                <Input
                  type="number"
                  value={wordPerChapter}
                  onChange={(e) => setWordPerChapter(Number(e.target.value))}
                  min={800}
                  max={3000}
                  addonAfter="字"
                />
              </div>
              <div>
                <div className="label">字数统计</div>
                <div className="word-count">{(wordCount / 10000).toFixed(2)}万字</div>
              </div>
            </Space>
          </div>

          <Divider />

          {/* Chapter Management */}
          <div className="chapter-section">
            <div className="section-header">
              <span className="section-title">章节管理</span>
              <Button
                type="link"
                size="small"
                icon={<PlusOutlined />}
                onClick={handleAddChapter}
              >
                新建
              </Button>
            </div>
            <div className="chapter-list">
              {chapters.map(chapter => (
                <div
                  key={chapter.id}
                  className={`chapter-item ${chapter.id === currentChapterId ? 'active' : ''}`}
                  onClick={() => setCurrentChapterId(chapter.id)}
                >
                  <div className="chapter-title">{chapter.title}</div>
                  <div className="chapter-words">{chapter.words}字</div>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* AI Assistance */}
          <div className="ai-section">
            <div className="section-title">AI辅助</div>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Button block icon={<FileTextOutlined />} onClick={() => handleAIFunction('outline')}>
                大纲生成
              </Button>
              <Button block icon={<RobotOutlined />}>
                角色管理 ({characters.length})
              </Button>
            </Space>
          </div>

          <Divider />

          {/* Snowflake Method */}
          <Collapse ghost>
            <Panel header="雪花写作法引导" key="1">
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div>
                  <div className="label">步骤1: 核心概括</div>
                  <TextArea
                    value={snowflakeData.step1}
                    onChange={(e) => setSnowflakeData({...snowflakeData, step1: e.target.value})}
                    rows={2}
                    placeholder="一句话概括故事"
                  />
                </div>
                <Progress percent={25} size="small" />
              </Space>
            </Panel>
          </Collapse>
        </Card>
      </div>

      {/* Center Editor Area */}
      <div className="editor-center-panel">
        {/* Toolbar */}
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <Space>
              <Tooltip title="续写">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleAIFunction('continue')}
                  loading={aiGenerating}
                >
                  续写
                </Button>
              </Tooltip>
              <Tooltip title="润色">
                <Button
                  icon={<RobotOutlined />}
                  onClick={() => handleAIFunction('polish')}
                >
                  润色
                </Button>
              </Tooltip>
              <Tooltip title="扩写">
                <Button onClick={() => handleAIFunction('expand')}>扩写</Button>
              </Tooltip>
              <Tooltip title="改写">
                <Button onClick={() => handleAIFunction('rewrite')}>改写</Button>
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
              <Tooltip title="使用 AI 将小说转换为剧本格式">
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  onClick={handleConvertToScreenplay}
                  style={{ background: '#7C3AED', borderColor: '#7C3AED' }}
                >
                  转为剧本
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
            <h2>{currentChapter?.title}</h2>
          </div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="quill-editor"
            placeholder="开始你的创作..."
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
          <span>当前章节: {currentChapter?.title}</span>
          <span>字数: {wordCount}字</span>
          <span>行数: {content.split('\n').length}</span>
        </div>
      </div>

      {/* Right Preview Panel */}
      {showPreview && (
        <div className="editor-right-panel">
          <Card size="small" title="实时预览" className="panel-card">
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Card>

          <Card size="small" title="问题提示" className="panel-card" style={{ marginTop: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="problem-item">
                <WarningOutlined style={{ color: '#F59E0B' }} />
                <span>第3章出现角色名不一致</span>
              </div>
              <div className="problem-item">
                <WarningOutlined style={{ color: '#F59E0B' }} />
                <span>第5章情节与第2章矛盾</span>
              </div>
            </Space>
          </Card>

          <Card size="small" title="创作建议" className="panel-card" style={{ marginTop: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="suggestion-item">
                <BulbOutlined style={{ color: '#10B981' }} />
                <span>可以增加角色冲突</span>
              </div>
              <div className="suggestion-item">
                <BulbOutlined style={{ color: '#10B981' }} />
                <span>节奏偏慢，建议加快</span>
              </div>
            </Space>
          </Card>
        </div>
      )}
    </div>
  );
}

export default NovelEditor;
