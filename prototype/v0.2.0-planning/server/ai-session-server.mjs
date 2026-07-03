import http from 'node:http'
import { readFileSync, existsSync } from 'node:fs'

const envFile = process.env.JUGO_AI_ENV_FILE
if (envFile && existsSync(envFile)) {
  loadEnvFile(envFile)
}

const port = Number(process.env.JUGO_AI_PORT || 18082)
const host = process.env.JUGO_AI_HOST || '127.0.0.1'
const apiKey = process.env.JUGO_AI_OPENAI_API_KEY || process.env.OPENAI_API_KEY || ''
const baseUrl = stripTrailingSlash(process.env.JUGO_AI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1')
const model = process.env.JUGO_AI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini'

const server = http.createServer(async (request, response) => {
  try {
    setCorsHeaders(response)

    if (request.method === 'OPTIONS') {
      response.writeHead(204)
      response.end()
      return
    }

    if (request.method === 'GET' && request.url === '/health') {
      sendJson(response, 200, {
        ok: true,
        provider: apiKey ? 'openai-compatible' : 'fallback-agent',
        model: apiKey ? model : null
      })
      return
    }

    if (request.method === 'POST' && request.url === '/session') {
      const payload = await readJsonBody(request)
      const result = apiKey
        ? await runModelAgent(payload)
        : runFallbackAgent(payload)
      sendJson(response, 200, result)
      return
    }

    sendJson(response, 404, { ok: false, error: 'not_found' })
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: 'ai_session_error',
      message: error.message || 'AI 会话服务异常'
    })
  }
})

server.listen(port, host, () => {
  console.log(`JUGO AI session service listening on http://${host}:${port}`)
  console.log(`JUGO AI provider: ${apiKey ? 'openai-compatible' : 'fallback-agent'}`)
})

function loadEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return
    const [key, ...valueParts] = trimmed.split('=')
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
    if (!process.env[key.trim()]) {
      process.env[key.trim()] = value
    }
  })
}

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(payload))
}

async function readJsonBody(request) {
  const chunks = []
  for await (const chunk of request) {
    chunks.push(chunk)
  }
  if (chunks.length === 0) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

async function runModelAgent(payload) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: createSystemPrompt()
        },
        {
          role: 'user',
          content: JSON.stringify({
            project: payload.project || {},
            allowedViews: payload.allowedViews || [],
            worldview: payload.worldview || {},
            messages: payload.messages || []
          })
        }
      ],
      response_format: { type: 'json_object' }
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`model_request_failed: ${response.status} ${text.slice(0, 160)}`)
  }

  const completion = await response.json()
  const content = completion.choices?.[0]?.message?.content || '{}'
  const parsed = JSON.parse(content)

  return normalizeAgentResult({
    provider: 'openai-compatible',
    reply: parsed.reply,
    actions: parsed.actions
  })
}

function createSystemPrompt() {
  return [
    '你是 JUGO 项目编辑页的 AI 助手，目标是根据用户中文指令生成可执行的项目编辑动作。',
    '必须只返回 JSON object，不要返回 Markdown。',
    'JSON 结构：{"reply":"给用户的中文回复","actions":[...]}。',
    '允许的 action.type：update_project_info, switch_view, update_worldview_root。',
    'update_project_info 参数：projectName?, worldName?。',
    'switch_view 参数：view，必须来自 allowedViews。',
    'update_worldview_root 参数：title?, summary?。',
    '如果用户只是咨询或无法判断编辑意图，actions 返回空数组。',
    '不要编造不支持的动作。'
  ].join('\n')
}

function runFallbackAgent(payload) {
  const messages = Array.isArray(payload.messages) ? payload.messages : []
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content || ''
  const project = payload.project || {}
  const allowedViews = Array.isArray(payload.allowedViews) ? payload.allowedViews : []
  const actions = []

  const projectName = matchChineseValue(lastUserMessage, [
    /项目名称?(?:改为|改成|设置为|命名为)\s*([^，。；\n]+)/,
    /把项目(?:名称|名)\s*(?:改为|改成|设置为)\s*([^，。；\n]+)/
  ])
  const worldName = matchChineseValue(lastUserMessage, [
    /世界名称?(?:改为|改成|设置为|命名为)\s*([^，。；\n]+)/,
    /把世界(?:名称|名)\s*(?:改为|改成|设置为)\s*([^，。；\n]+)/
  ])

  if (projectName || worldName) {
    actions.push({
      type: 'update_project_info',
      projectName,
      worldName
    })
  }

  const view = inferTargetView(lastUserMessage, allowedViews)
  if (view) {
    actions.push({ type: 'switch_view', view })
  }

  const rootSummary = matchChineseValue(lastUserMessage, [
    /世界观(?:根节点)?摘要(?:改为|改成|设置为)\s*([^，；\n]+)/,
    /把世界观(?:根节点)?摘要\s*(?:改为|改成|设置为)\s*([^，；\n]+)/
  ])
  if (rootSummary) {
    actions.push({
      type: 'update_worldview_root',
      summary: rootSummary
    })
  }

  const reply = actions.length > 0
    ? `已理解你的指令，准备执行 ${actions.length} 项编辑。`
    : `我可以帮你修改项目名称、世界名称、切换视图，或更新世界观根节点摘要。当前项目是「${project.name || '未命名项目'}」。`

  return normalizeAgentResult({
    provider: 'fallback-agent',
    reply,
    actions
  })
}

function matchChineseValue(text, patterns) {
  for (const pattern of patterns) {
    const matched = text.match(pattern)
    if (matched?.[1]) {
      return matched[1].trim().replace(/[。；，,.]+$/, '')
    }
  }
  return ''
}

function inferTargetView(text, allowedViews) {
  const navigationMatched = text.match(/(?:切换|打开|进入|跳转|转到|显示|查看|回到|前往|去到|去)\s*(?:到|至)?\s*([^，。；\n]*)/)
  if (!navigationMatched) return ''

  const navigationText = navigationMatched[0]
  const viewMap = [
    ['worldview', ['世界观', '思维导图', '百科']],
    ['timeline', ['矩阵时序', '时序', '时间线']],
    ['branch-tree', ['分支树', '分支']]
  ]

  const matched = viewMap.find(([, keywords]) => keywords.some((keyword) => navigationText.includes(keyword)))?.[0]
  return matched && allowedViews.includes(matched) ? matched : ''
}

function normalizeAgentResult(result) {
  return {
    ok: true,
    provider: result.provider || 'fallback-agent',
    reply: String(result.reply || '已处理。'),
    actions: Array.isArray(result.actions)
      ? result.actions.filter((action) => action && typeof action.type === 'string')
      : []
  }
}

function stripTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}
