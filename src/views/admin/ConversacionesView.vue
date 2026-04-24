<template>
  <div class="conv-page">

    <!-- ── Left: conversation list ── -->
    <aside class="conv-list" :class="{ 'conv-list--hidden': selected }">
      <div class="conv-list__header">
        <h1 class="page-title">Conversaciones</h1>
        <button class="icon-btn" @click="fetchConversations" title="Actualizar">
          <RefreshCw :size="15" :class="{ spinning: listLoading }" />
        </button>
      </div>

      <!-- Status filter -->
      <div class="filter-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="filter-tab"
          :class="{ 'filter-tab--active': selectedStatus === tab.value }"
          @click="selectStatus(tab.value)"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="filter-tab__count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- List -->
      <div v-if="listLoading" class="list-skeletons">
        <div v-for="i in 5" :key="i" class="conv-item conv-item--skeleton" />
      </div>

      <div v-else-if="conversations.length === 0" class="list-empty">
        <MessageCircle :size="32" />
        <p>Sin conversaciones</p>
      </div>

      <div v-else class="conv-items">
        <button
          v-for="conv in conversations"
          :key="conv.id"
          class="conv-item"
          :class="{ 'conv-item--active': selected?.id === conv.id }"
          @click="openConversation(conv)"
        >
          <div class="conv-item__avatar">
            {{ (conv.nombre || conv.contact_id).charAt(0).toUpperCase() }}
          </div>
          <div class="conv-item__body">
            <div class="conv-item__top">
              <span class="conv-item__name">{{ conv.nombre || conv.contact_id }}</span>
              <span class="conv-item__time">{{ relativeTime(conv.ultima_actividad) }}</span>
            </div>
            <div class="conv-item__bottom">
              <span class="conv-item__preview">{{ lastMessage(conv) }}</span>
              <div class="conv-item__badges">
                <span v-if="conv.tomado_por_humano" class="badge badge--human">
                  <UserCheck :size="10" /> Tomada
                </span>
                <span class="badge" :class="`badge--${conv.estado}`">{{ conv.estado }}</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- ── Right: chat panel ── -->
    <section class="chat-panel" :class="{ 'chat-panel--visible': selected }">

      <!-- Empty state -->
      <div v-if="!selected" class="chat-empty">
        <MessageCircle :size="48" />
        <p>Selecciona una conversación</p>
      </div>

      <template v-else>
        <!-- Chat header -->
        <div class="chat-header">
          <button class="icon-btn chat-header__back" @click="selected = null">
            <ArrowLeft :size="18" />
          </button>
          <div class="chat-header__avatar">
            {{ (selected.nombre || selected.contact_id).charAt(0).toUpperCase() }}
          </div>
          <div class="chat-header__info">
            <h2 class="chat-header__name">{{ selected.nombre || selected.contact_id }}</h2>
            <span class="chat-header__meta">
              <component :is="platformIcon(selected.plataforma)" :size="12" />
              {{ platformLabel(selected.plataforma) }}
              <span v-if="selected.username" class="chat-header__username">@{{ selected.username }}</span>
            </span>
          </div>

          <div class="chat-header__actions">
            <!-- Estado select -->
            <select class="estado-select" :value="selected.estado" @change="changeEstado($event.target.value)">
              <option value="nuevo">Nuevo</option>
              <option value="activo">Activo</option>
              <option value="esperando">Esperando</option>
              <option value="tomado">Tomado</option>
              <option value="cerrado">Cerrado</option>
            </select>

            <!-- Human takeover toggle -->
            <button
              class="takeover-btn"
              :class="{ 'takeover-btn--active': selected.tomado_por_humano }"
              @click="toggleTakeover"
              :title="selected.tomado_por_humano ? 'Devolver al bot' : 'Tomar conversación'"
            >
              <component :is="selected.tomado_por_humano ? Bot : UserCheck" :size="15" />
              {{ selected.tomado_por_humano ? 'Devolver al bot' : 'Tomar conversación' }}
            </button>
          </div>
        </div>

        <!-- Human takeover banner -->
        <div v-if="selected.tomado_por_humano" class="takeover-banner">
          <UserCheck :size="14" />
          Estás en modo manual. El bot no responderá hasta que lo devuelvas.
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="messagesEl">
          <div v-if="chatLoading" class="chat-loading">
            <AppSpinner />
          </div>

          <template v-else>
            <div v-if="!selected.mensajes?.length" class="chat-no-messages">
              Sin mensajes aún
            </div>

            <div
              v-for="(msg, i) in selected.mensajes"
              :key="i"
              class="msg"
              :class="`msg--${msg.role}`"
            >
              <div class="msg__bubble">
                <p class="msg__text">{{ msg.content }}</p>
                <span class="msg__time">{{ formatMsgTime(msg.ts) }}</span>
              </div>
              <span class="msg__role-label">
                {{ roleLabel(msg.role) }}
              </span>
            </div>
          </template>
        </div>

        <!-- Notes -->
        <div class="chat-notes">
          <textarea
            v-model="notesText"
            class="notes-input"
            placeholder="Notas internas (no se envían al usuario)…"
            rows="2"
            @blur="saveNotes"
          />
        </div>

        <!-- Reply box (only if human has taken over) -->
        <div class="chat-reply">
          <div v-if="!selected.tomado_por_humano" class="chat-reply__bot-notice">
            <Bot :size="14" />
            El bot está respondiendo. Toma la conversación para responder manualmente.
          </div>

          <template v-else>
            <textarea
              v-model="replyText"
              class="reply-input"
              placeholder="Escribe tu respuesta…"
              rows="3"
              @keydown.ctrl.enter="sendReply"
              @keydown.meta.enter="sendReply"
            />
            <div class="reply-footer">
              <span class="reply-hint">Ctrl + Enter para enviar</span>
              <AppButton size="sm" :loading="replying" @click="sendReply">
                <Send :size="14" />
                Enviar
              </AppButton>
            </div>
          </template>
        </div>
      </template>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import {
  MessageCircle, RefreshCw, UserCheck, Bot, ArrowLeft,
  Instagram, MessageSquare, Send,
} from 'lucide-vue-next'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import AppButton  from '@/components/ui/AppButton.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const api   = useApi()
const toast = useToastStore()

// ── List ───────────────────────────────────────────────────────────────────
const conversations   = ref([])
const listLoading     = ref(false)
const selectedStatus  = ref('')

const statusTabs = computed(() => [
  { value: '',          label: 'Todas' },
  { value: 'nuevo',     label: 'Nuevas',    count: countBy('nuevo') },
  { value: 'activo',    label: 'Activas',   count: countBy('activo') },
  { value: 'esperando', label: 'Esperando', count: countBy('esperando') },
  { value: 'tomado',    label: 'Tomadas',   count: countBy('tomado') },
  { value: 'cerrado',   label: 'Cerradas' },
])

function countBy(estado) {
  const n = conversations.value.filter(c => c.estado === estado).length
  return n || undefined
}

async function fetchConversations() {
  listLoading.value = true
  try {
    const params = selectedStatus.value ? `?estado=${selectedStatus.value}` : ''
    const res = await api.get(`/admin/conversations${params}`)
    conversations.value = res.data ?? []
  } catch {
    toast.error('No se pudieron cargar las conversaciones')
  } finally {
    listLoading.value = false
  }
}

function selectStatus(val) {
  selectedStatus.value = val
  fetchConversations()
}

fetchConversations()

// ── Detail ─────────────────────────────────────────────────────────────────
const selected    = ref(null)
const chatLoading = ref(false)
const notesText   = ref('')
const messagesEl  = ref(null)

async function openConversation(conv) {
  selected.value    = conv
  notesText.value   = conv.notas ?? ''
  chatLoading.value = true
  replyText.value   = ''

  try {
    const res = await api.get(`/admin/conversations/${conv.id}`)
    selected.value  = res.data
    notesText.value = res.data.notas ?? ''
  } catch {
    toast.error('No se pudo cargar la conversación')
  } finally {
    chatLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

function scrollToBottom() {
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

watch(() => selected.value?.mensajes?.length, async () => {
  await nextTick()
  scrollToBottom()
})

// ── Estado & takeover ──────────────────────────────────────────────────────
async function changeEstado(estado) {
  try {
    const res = await api.patch(`/admin/conversations/${selected.value.id}`, { estado })
    selected.value = res.data
    syncListItem(res.data)
  } catch {
    toast.error('No se pudo actualizar el estado')
  }
}

async function toggleTakeover() {
  const tomado = !selected.value.tomado_por_humano
  try {
    const res = await api.patch(`/admin/conversations/${selected.value.id}`, {
      tomado_por_humano: tomado,
      estado: tomado ? 'tomado' : 'activo',
    })
    selected.value = res.data
    syncListItem(res.data)
    toast.success(tomado ? 'Conversación tomada — el bot está pausado' : 'Conversación devuelta al bot')
  } catch {
    toast.error('No se pudo cambiar el modo')
  }
}

async function saveNotes() {
  if (notesText.value === (selected.value?.notas ?? '')) return
  try {
    await api.patch(`/admin/conversations/${selected.value.id}`, { notas: notesText.value })
  } catch { /* silent */ }
}

// ── Reply ──────────────────────────────────────────────────────────────────
const replyText = ref('')
const replying  = ref(false)

async function sendReply() {
  if (!replyText.value.trim()) return
  replying.value = true
  try {
    const res = await api.post(`/admin/conversations/${selected.value.id}/reply`, {
      text: replyText.value.trim(),
    })
    selected.value = res.data
    syncListItem(res.data)
    replyText.value = ''
    toast.success('Mensaje enviado')
  } catch (err) {
    toast.error(err.message ?? 'No se pudo enviar el mensaje')
  } finally {
    replying.value = false
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function syncListItem(updated) {
  const idx = conversations.value.findIndex(c => c.id === updated.id)
  if (idx !== -1) conversations.value[idx] = updated
}

function lastMessage(conv) {
  const msgs = conv.mensajes ?? []
  if (!msgs.length) return 'Sin mensajes'
  const last = msgs[msgs.length - 1]
  return last.content?.slice(0, 60) + (last.content?.length > 60 ? '…' : '')
}

function relativeTime(ts) {
  if (!ts) return ''
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'ahora'
  if (mins < 60)  return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function formatMsgTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function roleLabel(role) {
  return { user: 'Usuario', agent: 'Bot', human: 'Tú' }[role] ?? role
}

function platformIcon(p) {
  return p === 'instagram_dm' || p === 'instagram_comment' ? Instagram : MessageSquare
}

function platformLabel(p) {
  return { instagram_dm: 'Instagram DM', instagram_comment: 'Instagram comentario' }[p] ?? p
}
</script>

<style lang="scss" scoped>
.conv-page {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: calc(100dvh - 48px); // subtract AppLayout top bar height if any
  gap: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// ── Shared ─────────────────────────────────────────────────────────────────
.page-title { font-size: $text-xl; font-weight: $fw-bold; letter-spacing: -0.02em; }

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: $radius-sm;
  border: 1px solid $border;
  background: none;
  color: $text-muted;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: $transition-fast;
  flex-shrink: 0;
  &:hover { border-color: $primary; color: $primary; }
}

.spinning { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

// ── Left panel ─────────────────────────────────────────────────────────────
.conv-list {
  border-right: 1px solid $border;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: $bg-surface;

  @media (max-width: 768px) {
    &--hidden { display: none; }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-4 $space-4 $space-3;
    border-bottom: 1px solid $border;
    flex-shrink: 0;
  }
}

.filter-tabs {
  display: flex;
  gap: 2px;
  padding: $space-2 $space-3;
  flex-shrink: 0;
  flex-wrap: wrap;
  border-bottom: 1px solid $border;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: $space-1;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  border: none;
  background: transparent;
  color: $text-muted;
  font-size: $text-xs;
  font-weight: $fw-medium;
  cursor: pointer;
  transition: $transition-fast;
  white-space: nowrap;

  &:hover { color: $text; background: rgba(255,255,255,0.04); }

  &--active { background: $primary; color: #fff; }

  &__count {
    background: rgba(255,255,255,0.2);
    border-radius: 99px;
    padding: 0 5px;
    font-size: 10px;
    font-weight: $fw-bold;
  }
}

.list-skeletons { padding: $space-2; display: flex; flex-direction: column; gap: $space-2; }

.list-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  color: $text-subtle;
  font-size: $text-sm;
}

.conv-items {
  flex: 1;
  overflow-y: auto;
  padding: $space-2;
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.conv-item {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  padding: $space-3;
  border-radius: $radius-lg;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: $transition-fast;

  &:hover { background: rgba(124,111,255,0.06); border-color: $border; }

  &--active { background: rgba(124,111,255,0.1); border-color: rgba(124,111,255,0.3); }

  &--skeleton {
    height: 64px;
    background: $bg-card;
    border: 1px solid $border;
    animation: shimmer 1.5s infinite;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(124,111,255,0.15);
    color: $primary;
    font-size: $text-sm;
    font-weight: $fw-bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body { flex: 1; min-width: 0; }

  &__top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: $space-2;
    margin-bottom: 2px;
  }

  &__name  { font-size: $text-sm; font-weight: $fw-medium; color: $text; }
  &__time  { font-size: 11px; color: $text-subtle; flex-shrink: 0; font-family: $font-mono; }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
  }

  &__preview {
    font-size: $text-xs;
    color: $text-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  &__badges { display: flex; gap: 4px; flex-shrink: 0; }
}

// ── Badges ─────────────────────────────────────────────────────────────────
.badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 6px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: $fw-semibold;

  &--human    { background: rgba(244,63,94,0.15);  color: $danger; }
  &--nuevo    { background: rgba(99,102,241,0.15); color: #818cf8; }
  &--activo   { background: rgba(52,211,153,0.15); color: $accent; }
  &--esperando { background: rgba(245,158,11,0.15); color: #f59e0b; }
  &--tomado   { background: rgba(244,63,94,0.12);  color: $danger; }
  &--cerrado  { background: rgba(139,138,168,0.15); color: $text-muted; }
}

// ── Right: chat panel ──────────────────────────────────────────────────────
.chat-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: $bg;

  @media (max-width: 768px) {
    display: none;
    &--visible { display: flex; }
  }
}

.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-3;
  color: $text-subtle;
  font-size: $text-sm;
}

// ── Chat header ────────────────────────────────────────────────────────────
.chat-header {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-5;
  border-bottom: 1px solid $border;
  background: $bg-surface;
  flex-shrink: 0;

  &__back { display: none; @media (max-width: 768px) { display: flex; } }

  &__avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(124,111,255,0.15);
    color: $primary;
    font-weight: $fw-bold;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__info { flex: 1; min-width: 0; }
  &__name { font-size: $text-base; font-weight: $fw-semibold; color: $text; }
  &__meta {
    display: flex;
    align-items: center;
    gap: $space-1;
    font-size: $text-xs;
    color: $text-muted;
  }
  &__username { color: $primary; }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-shrink: 0;
  }
}

.estado-select {
  height: 30px;
  padding: 0 $space-2;
  background: $bg-input;
  border: 1px solid $border;
  border-radius: $radius-sm;
  color: $text;
  font-size: $text-xs;
  outline: none;
  cursor: pointer;
  transition: $transition-fast;
  &:focus { border-color: $primary; }
}

.takeover-btn {
  display: flex;
  align-items: center;
  gap: $space-1;
  height: 30px;
  padding: 0 $space-3;
  border-radius: $radius-sm;
  border: 1px solid $border;
  background: none;
  color: $text-muted;
  font-size: $text-xs;
  font-weight: $fw-medium;
  cursor: pointer;
  transition: $transition-fast;
  white-space: nowrap;

  &:hover { border-color: $primary; color: $primary; }

  &--active {
    background: rgba(244,63,94,0.1);
    border-color: rgba(244,63,94,0.3);
    color: $danger;
    &:hover { background: rgba(244,63,94,0.15); }
  }
}

.takeover-banner {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-2 $space-5;
  background: rgba(244,63,94,0.08);
  border-bottom: 1px solid rgba(244,63,94,0.2);
  font-size: $text-xs;
  font-weight: $fw-medium;
  color: $danger;
  flex-shrink: 0;
}

// ── Messages area ──────────────────────────────────────────────────────────
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-4;
  scroll-behavior: smooth;
}

.chat-loading,
.chat-no-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: $text-subtle;
  font-size: $text-sm;
}

.msg {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &--user  { align-items: flex-start; }
  &--agent { align-items: flex-end; }
  &--human { align-items: flex-end; }

  &__bubble {
    max-width: 72%;
    padding: $space-3 $space-4;
    border-radius: $radius-xl;
    line-height: 1.5;

    .msg--user &  { background: $bg-card; border: 1px solid $border; border-bottom-left-radius: $radius-sm; }
    .msg--agent & { background: rgba(124,111,255,0.15); border: 1px solid rgba(124,111,255,0.2); border-bottom-right-radius: $radius-sm; }
    .msg--human & { background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.2); border-bottom-right-radius: $radius-sm; }
  }

  &__text {
    font-size: $text-sm;
    color: $text;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__time {
    display: block;
    font-size: 10px;
    color: $text-subtle;
    margin-top: $space-1;
    font-family: $font-mono;
    text-align: right;
  }

  &__role-label {
    font-size: 10px;
    color: $text-subtle;
    padding: 0 $space-1;
  }
}

// ── Notes ──────────────────────────────────────────────────────────────────
.chat-notes {
  padding: $space-2 $space-4;
  border-top: 1px solid $border;
  flex-shrink: 0;
}

.notes-input {
  width: 100%;
  padding: $space-2 $space-3;
  background: rgba(245,158,11,0.05);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: $radius;
  color: $text-muted;
  font-size: $text-xs;
  resize: none;
  outline: none;
  font-family: inherit;
  transition: $transition-fast;
  &::placeholder { color: $text-subtle; }
  &:focus { border-color: rgba(245,158,11,0.4); background: rgba(245,158,11,0.08); }
}

// ── Reply box ──────────────────────────────────────────────────────────────
.chat-reply {
  padding: $space-3 $space-4 $space-4;
  border-top: 1px solid $border;
  background: $bg-surface;
  flex-shrink: 0;

  &__bot-notice {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-3;
    background: rgba(124,111,255,0.06);
    border: 1px solid rgba(124,111,255,0.15);
    border-radius: $radius;
    font-size: $text-xs;
    color: $text-muted;
  }
}

.reply-input {
  width: 100%;
  padding: $space-3;
  background: $bg-input;
  border: 1px solid $border;
  border-radius: $radius;
  color: $text;
  font-size: $text-sm;
  resize: none;
  outline: none;
  font-family: inherit;
  line-height: 1.5;
  transition: $transition;
  &::placeholder { color: $text-subtle; }
  &:focus { border-color: $primary; box-shadow: 0 0 0 3px $primary-glow; }
}

.reply-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: $space-2;
}

.reply-hint { font-size: $text-xs; color: $text-subtle; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
