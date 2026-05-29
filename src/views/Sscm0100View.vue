<template>
  <div class="sscm0100" data-testid="page-sscm0100">
    <!-- 조회 조건 -->
    <div class="search-area" data-testid="search-area">
      <div class="search-row">
        <span class="search-label">공통코드분류</span>
        <div class="search-input-wrap">
          <select v-model="cond.cmmnCd" class="form-select" data-testid="sel-cmmn-cd">
            <option value="">전체</option>
            <option v-for="c in programCatCodes" :key="c.code" :value="c.code">{{ c.code }} &nbsp; {{ c.fullNm }}</option>
          </select>
        </div>
        <span class="search-label">공통코드/명</span>
        <div class="search-input-wrap">
          <input v-model="cond.cmmnCdNm" type="text" class="form-input" placeholder="코드 또는 명칭" data-testid="input-cmmn-cd-nm"
            @keyup.enter="handleSearch" />
        </div>
        <span class="search-label">코드값/명</span>
        <div class="search-input-wrap">
          <input v-model="cond.cdValNm" type="text" class="form-input" placeholder="코드값 명칭" data-testid="input-cd-val-nm"
            @keyup.enter="handleSearch" />
        </div>
        <button class="btn btn-primary" @click="handleSearch" data-testid="btn-search" :disabled="loading010">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          조회
        </button>
      </div>
      <div class="search-row">
        <span class="search-label">사용여부</span>
        <div class="search-input-wrap">
          <select v-model="cond.useYn" class="form-select" data-testid="sel-use-yn">
            <option value="">전체</option>
            <option v-for="c in useYnCodes" :key="c.code" :value="c.code">{{ c.fullNm }}</option>
          </select>
        </div>
        <span class="search-label">코드값 사용여부</span>
        <div class="search-input-wrap">
          <select v-model="cond.detailUseYn" class="form-select" data-testid="sel-detail-use-yn">
            <option value="">전체</option>
            <option v-for="c in useYnCodes" :key="c.code" :value="c.code">{{ c.fullNm }}</option>
          </select>
        </div>
        <span class="search-label">구코드</span>
        <div class="search-input-wrap">
          <input v-model="cond.osysCmmnCd" type="text" class="form-input" placeholder="구 시스템 코드" data-testid="input-osys-cmmn-cd"
            @keyup.enter="handleSearch" />
        </div>
      </div>
    </div>

    <!-- 그리드 영역 -->
    <div class="grid-container">
      <!-- 공통코드 목록 -->
      <div class="grid-wrap" data-testid="grid-csys010-wrap">
        <div class="grid-header">
          <span class="grid-title">📋 공통코드 목록</span>
          <div class="grid-actions">
            <button class="btn btn-secondary btn-sm" @click="handleAdd010" data-testid="btn-add-010" :disabled="!searched">추가</button>
            <button class="btn btn-secondary btn-sm" @click="handleDelete010" data-testid="btn-del-010" :disabled="!searched">삭제</button>
            <button class="btn btn-primary btn-sm" @click="handleSave010" data-testid="btn-save-010" :disabled="!isModified010">저장</button>
            <button class="btn btn-secondary btn-sm" @click="handleExcel010" data-testid="btn-excel-010">Excel</button>
          </div>
        </div>
        <div class="grid-table-wrap" style="overflow-x:auto;">
          <table class="data-table" data-testid="grid-csys010">
            <thead>
              <tr>
                <th style="width:36px"><input type="checkbox" @change="toggleAllCheck010" :checked="allChecked010" /></th>
                <th style="width:36px">상태</th>
                <th style="width:36px">순번</th>
                <th class="required" style="width:90px">공통코드</th>
                <th class="required" style="width:130px">공통코드명</th>
                <th style="width:140px">공통코드영문명</th>
                <th style="width:48px">사용여부</th>
                <th style="width:70px">구코드</th>
                <th style="width:110px">그룹코드</th>
                <th style="min-width:100px">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading010">
                <td colspan="10" class="cell-center" style="padding:32px">
                  <span class="loading-dot">⏳ 조회 중...</span>
                </td>
              </tr>
              <tr v-else-if="!searched">
                <td colspan="10" class="cell-center" style="padding:32px; color:#b0b6c0;">조회 버튼을 클릭하여 데이터를 조회하세요.</td>
              </tr>
              <tr v-else-if="codeList010.length === 0">
                <td colspan="10" class="cell-center" style="padding:32px; color:#b0b6c0;">조회된 데이터가 없습니다.</td>
              </tr>
              <tr
                v-else
                v-for="(row, idx) in codeList010"
                :key="row._key"
                :class="[
                  { selected: selectedCode === row.cmmnCd && row._state !== 'I' },
                  { inserted: row._state === 'I' },
                  { modified: row._state === 'U' }
                ]"
                @click="handleSelect010(row)"
                :data-testid="`row-010-${idx}`"
              >
                <td class="cell-center" @click.stop>
                  <input type="checkbox" v-model="row._checked" class="check-yn" :data-testid="`chk-010-${idx}`" />
                </td>
                <td class="cell-center">
                  <span class="status-badge" :class="getStateCls(row._state)">{{ getStateLabel(row._state) }}</span>
                </td>
                <td class="cell-center">{{ idx + 1 }}</td>
                <td class="cell-center">
                  <input
                    v-model="row.cmmnCd"
                    type="text"
                    class="cell-input"
                    :class="{ 'display-text': row._state !== 'I' }"
                    :readonly="row._state !== 'I'"
                    maxlength="8"
                    @input="markModified(row)"
                    :data-testid="`cell-010-cmmnCd-${idx}`"
                  />
                </td>
                <td>
                  <input v-model="row.cmmnCdNm" type="text" class="cell-input" maxlength="200"
                    @input="markModified(row)" :data-testid="`cell-010-cmmnCdNm-${idx}`" />
                </td>
                <td>
                  <input v-model="row.cmmnCdEngNm" type="text" class="cell-input" maxlength="200"
                    @input="markModified(row)" />
                </td>
                <td class="cell-center">
                  <input type="checkbox" v-model="row.useYn" true-value="1" false-value="0"
                    class="check-yn" @change="markModified(row)" :data-testid="`cell-010-useYn-${idx}`" />
                </td>
                <td class="cell-center">
                  <input v-model="row.osysCmmnCd" type="text" class="cell-input" maxlength="200"
                    @input="markModified(row)" />
                </td>
                <td class="cell-center">
                  <span class="chip" v-if="row.grpYn === 'Y'">그룹</span>
                  <span style="color:#c0c4cc; font-size:12px;" v-else>-</span>
                </td>
                <td>
                  <input v-model="row.remrk" type="text" class="cell-input" maxlength="4000"
                    @input="markModified(row)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grid-footer">
          <span class="total-count">총 {{ codeList010.length }}건</span>
          <span class="text-muted" style="margin-left:10px; font-size:11px;" v-if="isModified010">※ 저장되지 않은 변경사항이 있습니다.</span>
        </div>
      </div>

      <!-- 공통코드값 목록 -->
      <div class="grid-wrap" data-testid="grid-csys011-wrap">
        <div class="grid-header">
          <span class="grid-title">📄 공통코드값 목록 <span v-if="selectedCode" class="chip" style="margin-left:6px;">{{ selectedCode }}</span></span>
          <div class="grid-actions">
            <button class="btn btn-secondary btn-sm" @click="handleAdd011" data-testid="btn-add-011" :disabled="!selectedCode">추가</button>
            <button class="btn btn-secondary btn-sm" @click="handleDelete011" data-testid="btn-del-011" :disabled="!selectedCode">삭제</button>
            <button class="btn btn-primary btn-sm" @click="handleSave011" data-testid="btn-save-011" :disabled="!isModified011">저장</button>
            <button class="btn btn-secondary btn-sm" @click="handleExcel011" data-testid="btn-excel-011">Excel</button>
          </div>
        </div>
        <div class="grid-table-wrap" style="overflow-x:auto;">
          <table class="data-table" data-testid="grid-csys011">
            <thead>
              <tr>
                <th style="width:36px"><input type="checkbox" @change="toggleAllCheck011" :checked="allChecked011" /></th>
                <th style="width:36px">상태</th>
                <th class="required" style="width:80px">코드값</th>
                <th class="required" style="width:100px">코드값명</th>
                <th style="width:80px">약어명</th>
                <th style="width:48px">사용여부</th>
                <th style="width:60px">표시순서</th>
                <th style="width:70px">구코드</th>
                <th style="width:100px">시작일자</th>
                <th style="width:100px">종료일자</th>
                <th style="min-width:100px">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading011">
                <td colspan="11" class="cell-center" style="padding:32px"><span>⏳ 조회 중...</span></td>
              </tr>
              <tr v-else-if="!selectedCode">
                <td colspan="11" class="cell-center" style="padding:32px; color:#b0b6c0;">좌측 공통코드를 선택하면 코드값이 표시됩니다.</td>
              </tr>
              <tr v-else-if="codeList011.length === 0">
                <td colspan="11" class="cell-center" style="padding:32px; color:#b0b6c0;">등록된 코드값이 없습니다.</td>
              </tr>
              <tr
                v-else
                v-for="(row, idx) in codeList011"
                :key="row._key"
                :class="[{ inserted: row._state === 'I' }, { modified: row._state === 'U' }]"
                :data-testid="`row-011-${idx}`"
              >
                <td class="cell-center" @click.stop>
                  <input type="checkbox" v-model="row._checked" class="check-yn" :data-testid="`chk-011-${idx}`" />
                </td>
                <td class="cell-center">
                  <span class="status-badge" :class="getStateCls(row._state)">{{ getStateLabel(row._state) }}</span>
                </td>
                <td class="cell-center">
                  <input v-model="row.cmmnCdVal" type="text" class="cell-input"
                    :class="{ 'display-text': row._state !== 'I' }"
                    :readonly="row._state !== 'I'"
                    maxlength="15"
                    @input="markModified(row)"
                    :data-testid="`cell-011-cmmnCdVal-${idx}`" />
                </td>
                <td>
                  <input v-model="row.cdValNm" type="text" class="cell-input" maxlength="200"
                    @input="markModified(row)" :data-testid="`cell-011-cdValNm-${idx}`" />
                </td>
                <td>
                  <input v-model="row.cdValAbnm" type="text" class="cell-input" maxlength="100"
                    @input="markModified(row)" />
                </td>
                <td class="cell-center">
                  <input type="checkbox" v-model="row.useYn" true-value="1" false-value="0"
                    class="check-yn" @change="markModified(row)" />
                </td>
                <td class="cell-right">
                  <input v-model.number="row.dispOrd" type="number" class="cell-input" style="text-align:right;"
                    @input="markModified(row)" />
                </td>
                <td class="cell-center">
                  <input v-model="row.osysCmmnCdVal" type="text" class="cell-input" maxlength="200"
                    @input="markModified(row)" />
                </td>
                <td class="cell-center">
                  <input v-model="row.useBeginDt" type="text" class="cell-input" maxlength="8" placeholder="YYYYMMDD"
                    @input="markModified(row)" />
                </td>
                <td class="cell-center">
                  <input v-model="row.useStopDt" type="text" class="cell-input" maxlength="8" placeholder="YYYYMMDD"
                    @input="markModified(row)" />
                </td>
                <td>
                  <input v-model="row.remrk" type="text" class="cell-input" maxlength="4000"
                    @input="markModified(row)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grid-footer">
          <span class="total-count">총 {{ codeList011.length }}건</span>
          <span class="text-muted" style="margin-left:10px; font-size:11px;" v-if="isModified011">※ 저장되지 않은 변경사항이 있습니다.</span>
        </div>
      </div>
    </div>

    <!-- 확인 다이얼로그 -->
    <div class="modal-overlay" v-if="confirm.show" data-testid="modal-confirm">
      <div class="modal-box" style="min-width:320px; max-width:400px;">
        <div class="modal-header">
          <span>{{ confirm.title }}</span>
        </div>
        <div class="modal-body">
          <p style="font-size:14px; line-height:1.6;">{{ confirm.message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="confirm.reject()" data-testid="btn-confirm-cancel">취소</button>
          <button class="btn btn-primary" @click="confirm.resolve()" data-testid="btn-confirm-ok">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import {
  findCommonCodeList, findCommonCodeValueList,
  saveCommonCodeList, saveCommonCodeValueList,
  USE_YN_CODES, PROGRAM_CAT_CODES
} from '../services/mockApi'
import { useToastStore } from '../stores/toast'

const toast = useToastStore()

const useYnCodes = USE_YN_CODES
const programCatCodes = PROGRAM_CAT_CODES

// 조회 조건
const cond = reactive({ cmmnCd: '', cmmnCdNm: '', cdValNm: '', useYn: '', detailUseYn: '', osysCmmnCd: '' })

// 공통코드 목록
const codeList010 = ref([])
const loading010 = ref(false)
const searched = ref(false)
const selectedCode = ref('')

// 공통코드값 목록
const codeList011 = ref([])
const loading011 = ref(false)

let keySeq = 0
function newKey() { return ++keySeq }

// 다이얼로그
const confirm = reactive({ show: false, title: '', message: '', resolve: null, reject: null })
function showConfirm(title, message) {
  return new Promise((res, rej) => {
    Object.assign(confirm, { show: true, title, message })
    confirm.resolve = () => { confirm.show = false; res(true) }
    confirm.reject  = () => { confirm.show = false; rej(new Error('cancel')) }
  })
}

// 상태 관련
function getStateCls(s) {
  return { normal: !s || s === 'N', inserted: s === 'I', modified: s === 'U', deleted: s === 'D' }
}
function getStateLabel(s) {
  return { I: '추가', U: '수정', D: '삭제', N: '정상' }[s] || '정상'
}
function markModified(row) {
  if (row._state !== 'I') row._state = 'U'
}

// 전체 체크
const allChecked010 = computed(() => codeList010.value.length > 0 && codeList010.value.every(r => r._checked))
function toggleAllCheck010(e) { codeList010.value.forEach(r => r._checked = e.target.checked) }
const allChecked011 = computed(() => codeList011.value.length > 0 && codeList011.value.every(r => r._checked))
function toggleAllCheck011(e) { codeList011.value.forEach(r => r._checked = e.target.checked) }

// 변경 여부
const isModified010 = computed(() => codeList010.value.some(r => r._state && r._state !== 'N'))
const isModified011 = computed(() => codeList011.value.some(r => r._state && r._state !== 'N'))

// ============================================================
// 조회
// ============================================================
async function handleSearch() {
  if (isModified010.value || isModified011.value) {
    try {
      await showConfirm('확인', '변경된 데이터가 있습니다. 조회하면 변경사항이 초기화됩니다. 계속 진행하시겠습니까?')
    } catch { return }
  }
  loading010.value = true
  selectedCode.value = ''
  codeList011.value = []
  try {
    const data = await findCommonCodeList({ ...cond })
    codeList010.value = data.map(r => ({ ...r, _key: newKey(), _checked: false, _state: 'N' }))
    searched.value = true
  } catch (e) {
    toast.error('조회 중 오류가 발생했습니다: ' + e.message)
  } finally {
    loading010.value = false
  }
}

async function loadCodeValues(cmmnCd) {
  loading011.value = true
  try {
    const data = await findCommonCodeValueList({ cmmnCd, detailUseYn: cond.detailUseYn })
    codeList011.value = data.map(r => ({ ...r, _key: newKey(), _checked: false, _state: 'N' }))
  } catch (e) {
    toast.error('코드값 조회 오류: ' + e.message)
  } finally {
    loading011.value = false
  }
}

// ============================================================
// 행 선택
// ============================================================
function handleSelect010(row) {
  if (row._state === 'I') return // 신규 행은 코드값 조회 불가
  if (isModified011.value) {
    showConfirm('확인', '코드값에 변경된 데이터가 있습니다. 이동하시겠습니까?')
      .then(() => selectRow010(row))
      .catch(() => {})
  } else {
    selectRow010(row)
  }
}
function selectRow010(row) {
  selectedCode.value = row.cmmnCd
  loadCodeValues(row.cmmnCd)
}

// ============================================================
// 공통코드 추가/삭제/저장
// ============================================================
function handleAdd010() {
  if (isModified011.value) {
    codeList011.value = []
    selectedCode.value = ''
  }
  codeList010.value.unshift({
    _key: newKey(), _checked: false, _state: 'I',
    cmmnCd: '', cmmnCdNm: '', cmmnCdEngNm: '', useYn: '1', remrk: '', osysCmmnCd: '', grpYn: 'N', cmmnCdChnNm: '', cmmnCdJpnNm: ''
  })
}

async function handleDelete010() {
  const checked = codeList010.value.filter(r => r._checked)
  if (!checked.length) { toast.warning('삭제할 항목을 선택하세요.'); return }
  try {
    await showConfirm('삭제 확인', `선택된 ${checked.length}건을 삭제하시겠습니까?`)
    checked.forEach(r => {
      if (r._state === 'I') {
        codeList010.value = codeList010.value.filter(x => x._key !== r._key)
      } else {
        r._state = 'D'
      }
    })
    if (checked.some(r => r.cmmnCd === selectedCode.value)) {
      selectedCode.value = ''
      codeList011.value = []
    }
  } catch {}
}

async function handleSave010() {
  const changed = codeList010.value.filter(r => r._state && r._state !== 'N')
  // 유효성
  for (const r of changed) {
    if (r._state === 'D') continue
    if (!r.cmmnCd.trim()) { toast.error('공통코드는 필수 입력값입니다.'); return }
    if (!r.cmmnCdNm.trim()) { toast.error('공통코드명은 필수 입력값입니다.'); return }
  }
  try {
    await saveCommonCodeList(changed)
    toast.success('저장되었습니다.')
    await handleSearch()
  } catch (e) {
    toast.error('저장 오류: ' + e.message)
  }
}

function handleExcel010() {
  const headers = ['공통코드', '공통코드명', '공통코드영문명', '사용여부', '구코드', '비고']
  const rows = codeList010.value.filter(r => r._state !== 'D').map(r =>
    [r.cmmnCd, r.cmmnCdNm, r.cmmnCdEngNm, r.useYn === '1' ? '사용' : '미사용', r.osysCmmnCd, r.remrk]
  )
  downloadCsv('공통코드목록', headers, rows)
}

// ============================================================
// 공통코드값 추가/삭제/저장
// ============================================================
function handleAdd011() {
  if (!selectedCode.value) { toast.warning('공통코드를 먼저 선택하세요.'); return }
  const maxOrd = Math.max(0, ...codeList011.value.map(r => r.dispOrd || 0))
  const nextOrd = (Math.floor(maxOrd / 10) + 1) * 10
  codeList011.value.push({
    _key: newKey(), _checked: false, _state: 'I',
    cmmnCd: selectedCode.value, cmmnCdVal: '', cdValNm: '', cdValAbnm: '', cdValEngNm: '', cdValEngAbnm: '',
    cdValChnNm: '', cdValJpnNm: '', useYn: '1', dispOrd: nextOrd, remrk: '', osysCmmnCdVal: '', useBeginDt: '', useStopDt: ''
  })
}

async function handleDelete011() {
  const checked = codeList011.value.filter(r => r._checked)
  if (!checked.length) { toast.warning('삭제할 항목을 선택하세요.'); return }
  try {
    await showConfirm('삭제 확인', `선택된 ${checked.length}건을 삭제하시겠습니까?`)
    checked.forEach(r => {
      if (r._state === 'I') {
        codeList011.value = codeList011.value.filter(x => x._key !== r._key)
      } else {
        r._state = 'D'
      }
    })
  } catch {}
}

async function handleSave011() {
  const changed = codeList011.value.filter(r => r._state && r._state !== 'N')
  for (const r of changed) {
    if (r._state === 'D') continue
    if (!r.cmmnCdVal.trim()) { toast.error('코드값은 필수 입력값입니다.'); return }
    if (!r.cdValNm.trim())   { toast.error('코드값명은 필수 입력값입니다.'); return }
  }
  try {
    await saveCommonCodeValueList(changed)
    toast.success('저장되었습니다.')
    await loadCodeValues(selectedCode.value)
  } catch (e) {
    toast.error('저장 오류: ' + e.message)
  }
}

function handleExcel011() {
  const headers = ['코드값', '코드값명', '약어명', '사용여부', '표시순서', '비고']
  const rows = codeList011.value.filter(r => r._state !== 'D').map(r =>
    [r.cmmnCdVal, r.cdValNm, r.cdValAbnm, r.useYn === '1' ? '사용' : '미사용', r.dispOrd, r.remrk]
  )
  downloadCsv('공통코드값목록', headers, rows)
}

// CSV 다운로드 유틸
function downloadCsv(name, headers, rows) {
  const bom = '﻿'
  const lines = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))]
  const blob = new Blob([bom + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${name}.csv`; a.click()
  URL.revokeObjectURL(url)
  toast.success(`${name}.csv 다운로드 완료`)
}
</script>

<style scoped>
.sscm0100 { display: flex; flex-direction: column; height: 100%; gap: 12px; }
.grid-container { display: flex; gap: 12px; flex: 1; min-height: 0; overflow: hidden; }
.grid-container .grid-wrap { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.grid-table-wrap { flex: 1; overflow: auto; }
.display-text { background: transparent !important; cursor: default; pointer-events: none; }
</style>
