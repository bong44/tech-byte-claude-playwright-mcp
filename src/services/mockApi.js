/**
 * Mock API Service
 * 실제 서버 없이 공통코드 관리(sscm0100) 비즈니스 로직을 시뮬레이션
 */

function delay(ms = 300) {
  return new Promise(r => setTimeout(r, ms))
}

// ============================================================
// Mock 데이터 저장소 (메모리)
// ============================================================
let mockCodeList = [
  { cmmnCd: 'CSYS0010', cmmnCdNm: '사용여부', cmmnCdEngNm: 'Use YN', useYn: '1', remrk: '공통 사용여부 코드', osysCmmnCd: '', grpYn: 'N', cmmnCdChnNm: '', cmmnCdJpnNm: '' },
  { cmmnCd: 'CSYS0020', cmmnCdNm: '성별코드', cmmnCdEngNm: 'Gender Code', useYn: '1', remrk: '성별 구분 코드', osysCmmnCd: 'GND', grpYn: 'N', cmmnCdChnNm: '性别', cmmnCdJpnNm: '性別' },
  { cmmnCd: 'CSYS0030', cmmnCdNm: '학년코드', cmmnCdEngNm: 'Grade Code', useYn: '1', remrk: '학년 구분 코드', osysCmmnCd: 'GRD', grpYn: 'N', cmmnCdChnNm: '年级', cmmnCdJpnNm: '学年' },
  { cmmnCd: 'CSYS0040', cmmnCdNm: '학기코드', cmmnCdEngNm: 'Semester Code', useYn: '1', remrk: '학기 구분 코드', osysCmmnCd: 'SEM', grpYn: 'Y', cmmnCdChnNm: '学期', cmmnCdJpnNm: '学期' },
  { cmmnCd: 'CSYS0050', cmmnCdNm: '국가코드', cmmnCdEngNm: 'Country Code', useYn: '1', remrk: '국가 코드', osysCmmnCd: 'CTY', grpYn: 'N', cmmnCdChnNm: '国家', cmmnCdJpnNm: '国家' },
  { cmmnCd: 'CSYS0060', cmmnCdNm: '프로그램중분류코드', cmmnCdEngNm: 'Program Category', useYn: '1', remrk: '프로그램 중분류', osysCmmnCd: '', grpYn: 'N', cmmnCdChnNm: '', cmmnCdJpnNm: '' },
  { cmmnCd: 'CSYS0070', cmmnCdNm: '첨부파일유형코드', cmmnCdEngNm: 'Attachment Type', useYn: '0', remrk: '미사용 코드', osysCmmnCd: 'ATT', grpYn: 'N', cmmnCdChnNm: '', cmmnCdJpnNm: '' },
  { cmmnCd: 'CSYS0080', cmmnCdNm: '권한유형코드', cmmnCdEngNm: 'Auth Type Code', useYn: '1', remrk: '시스템 권한', osysCmmnCd: '', grpYn: 'N', cmmnCdChnNm: '', cmmnCdJpnNm: '' },
]

let mockCodeValueMap = {
  'CSYS0010': [
    { cmmnCd: 'CSYS0010', cmmnCdVal: '1', cdValNm: '사용', cdValAbnm: 'Y', cdValEngNm: 'Use', cdValEngAbnm: 'Y', cdValChnNm: '使用', cdValJpnNm: '使用', useYn: '1', dispOrd: 10, remrk: '', osysCmmnCdVal: 'Y', useBeginDt: '20200101', useStopDt: '' },
    { cmmnCd: 'CSYS0010', cmmnCdVal: '0', cdValNm: '미사용', cdValAbnm: 'N', cdValEngNm: 'Disuse', cdValEngAbnm: 'N', cdValChnNm: '不使用', cdValJpnNm: '未使用', useYn: '1', dispOrd: 20, remrk: '', osysCmmnCdVal: 'N', useBeginDt: '20200101', useStopDt: '' },
  ],
  'CSYS0020': [
    { cmmnCd: 'CSYS0020', cmmnCdVal: 'M', cdValNm: '남', cdValAbnm: '남', cdValEngNm: 'Male', cdValEngAbnm: 'M', cdValChnNm: '男', cdValJpnNm: '男', useYn: '1', dispOrd: 10, remrk: '', osysCmmnCdVal: 'M', useBeginDt: '', useStopDt: '' },
    { cmmnCd: 'CSYS0020', cmmnCdVal: 'F', cdValNm: '여', cdValAbnm: '여', cdValEngNm: 'Female', cdValEngAbnm: 'F', cdValChnNm: '女', cdValJpnNm: '女', useYn: '1', dispOrd: 20, remrk: '', osysCmmnCdVal: 'F', useBeginDt: '', useStopDt: '' },
  ],
  'CSYS0030': [
    { cmmnCd: 'CSYS0030', cmmnCdVal: '1', cdValNm: '1학년', cdValAbnm: '1년', cdValEngNm: '1st Grade', cdValEngAbnm: '1G', cdValChnNm: '1年级', cdValJpnNm: '1年生', useYn: '1', dispOrd: 10, remrk: '', osysCmmnCdVal: '', useBeginDt: '', useStopDt: '' },
    { cmmnCd: 'CSYS0030', cmmnCdVal: '2', cdValNm: '2학년', cdValAbnm: '2년', cdValEngNm: '2nd Grade', cdValEngAbnm: '2G', cdValChnNm: '2年级', cdValJpnNm: '2年生', useYn: '1', dispOrd: 20, remrk: '', osysCmmnCdVal: '', useBeginDt: '', useStopDt: '' },
    { cmmnCd: 'CSYS0030', cmmnCdVal: '3', cdValNm: '3학년', cdValAbnm: '3년', cdValEngNm: '3rd Grade', cdValEngAbnm: '3G', cdValChnNm: '3年级', cdValJpnNm: '3年生', useYn: '1', dispOrd: 30, remrk: '', osysCmmnCdVal: '', useBeginDt: '', useStopDt: '' },
    { cmmnCd: 'CSYS0030', cmmnCdVal: '4', cdValNm: '4학년', cdValAbnm: '4년', cdValEngNm: '4th Grade', cdValEngAbnm: '4G', cdValChnNm: '4年级', cdValJpnNm: '4年生', useYn: '1', dispOrd: 40, remrk: '', osysCmmnCdVal: '', useBeginDt: '', useStopDt: '' },
  ],
  'CSYS0040': [
    { cmmnCd: 'CSYS0040', cmmnCdVal: '1', cdValNm: '1학기', cdValAbnm: '1학기', cdValEngNm: '1st Semester', cdValEngAbnm: '1S', cdValChnNm: '第一学期', cdValJpnNm: '1学期', useYn: '1', dispOrd: 10, remrk: '', osysCmmnCdVal: '', useBeginDt: '', useStopDt: '' },
    { cmmnCd: 'CSYS0040', cmmnCdVal: '2', cdValNm: '2학기', cdValAbnm: '2학기', cdValEngNm: '2nd Semester', cdValEngAbnm: '2S', cdValChnNm: '第二学期', cdValJpnNm: '2学期', useYn: '1', dispOrd: 20, remrk: '', osysCmmnCdVal: '', useBeginDt: '', useStopDt: '' },
  ],
}

// ============================================================
// API 함수
// ============================================================

/** 공통코드 목록 조회 */
export async function findCommonCodeList(params = {}) {
  await delay(400)
  let result = [...mockCodeList]

  if (params.cmmnCd)   result = result.filter(r => r.cmmnCd.includes(params.cmmnCd.toUpperCase()))
  if (params.cmmnCdNm) result = result.filter(r => r.cmmnCdNm.includes(params.cmmnCdNm))
  if (params.cdValNm) {
    const valueKeys = Object.keys(mockCodeValueMap)
    const matchedCodes = valueKeys.filter(k =>
      (mockCodeValueMap[k] || []).some(v => v.cdValNm.includes(params.cdValNm))
    )
    result = result.filter(r => matchedCodes.includes(r.cmmnCd))
  }
  if (params.useYn && params.useYn !== '')  result = result.filter(r => r.useYn === params.useYn)
  if (params.osysCmmnCd) result = result.filter(r => r.osysCmmnCd.includes(params.osysCmmnCd))

  return result.map((r, i) => ({ ...r, _rowIdx: i + 1 }))
}

/** 공통코드값 목록 조회 */
export async function findCommonCodeValueList(params = {}) {
  await delay(300)
  const list = mockCodeValueMap[params.cmmnCd] || []
  let result = [...list]
  if (params.detailUseYn && params.detailUseYn !== '') {
    result = result.filter(r => r.useYn === params.detailUseYn)
  }
  return result.map((r, i) => ({ ...r, _rowIdx: i + 1 }))
}

/** 공통코드 저장 */
export async function saveCommonCodeList(rows) {
  await delay(500)
  for (const row of rows) {
    if (row._state === 'I') {
      // INSERT
      if (mockCodeList.find(r => r.cmmnCd === row.cmmnCd)) {
        throw new Error(`이미 존재하는 공통코드입니다: ${row.cmmnCd}`)
      }
      mockCodeList.push({ ...row })
      mockCodeValueMap[row.cmmnCd] = []
    } else if (row._state === 'U') {
      // UPDATE
      const idx = mockCodeList.findIndex(r => r.cmmnCd === row.cmmnCd)
      if (idx >= 0) Object.assign(mockCodeList[idx], row)
    } else if (row._state === 'D') {
      // DELETE
      mockCodeList = mockCodeList.filter(r => r.cmmnCd !== row.cmmnCd)
      delete mockCodeValueMap[row.cmmnCd]
    }
  }
  return { success: true }
}

/** 공통코드값 저장 */
export async function saveCommonCodeValueList(rows) {
  await delay(500)
  if (!rows.length) return { success: true }
  const cmmnCd = rows[0].cmmnCd

  for (const row of rows) {
    if (!mockCodeValueMap[cmmnCd]) mockCodeValueMap[cmmnCd] = []
    const list = mockCodeValueMap[cmmnCd]

    if (row._state === 'I') {
      if (list.find(r => r.cmmnCdVal === row.cmmnCdVal)) {
        throw new Error(`이미 존재하는 코드값입니다: ${row.cmmnCdVal}`)
      }
      list.push({ ...row })
    } else if (row._state === 'U') {
      const idx = list.findIndex(r => r.cmmnCdVal === row.cmmnCdVal)
      if (idx >= 0) Object.assign(list[idx], row)
    } else if (row._state === 'D') {
      mockCodeValueMap[cmmnCd] = list.filter(r => r.cmmnCdVal !== row.cmmnCdVal)
    }
  }
  return { success: true }
}

/** 사용여부 공통코드 */
export const USE_YN_CODES = [
  { code: '1', fullNm: '사용' },
  { code: '0', fullNm: '미사용' }
]

/** 프로그램중분류 공통코드 */
export const PROGRAM_CAT_CODES = [
  { code: 'SYS', fullNm: '시스템관리' },
  { code: 'COM', fullNm: '공통' },
  { code: 'STD', fullNm: '학생' },
  { code: 'SCH', fullNm: '학사' }
]
