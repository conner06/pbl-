import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRanking()
  }, [])

  const fetchRanking = async () => {
    try {
      const key = import.meta.env.VITE_API_KEY

      // 1. 전체 건수 파악용 첫 요청 (서비스키 이중인코딩 방지)
      const first = await axios.get(
        `https://apis.data.go.kr/B553766/psgr/getStnPsgr?serviceKey=${key}&pageNo=1&numOfRows=1&type=json`
      )

      console.log('=== 응답 전체 ===', first.data)
      console.log('=== response ===', first.data?.response)
      console.log('=== body ===', first.data?.response?.body)
      console.log('=== totalCount ===', first.data?.response?.body?.totalCount)

      const body = first.data?.response?.body
      const totalCount = body?.totalCount

      if (!totalCount) {
        setError(`응답은 왔지만 데이터 없음: ${JSON.stringify(first.data).slice(0, 200)}`)
        return
      }

      // 2. 전체 데이터 한번에 요청
      const response = await axios.get(
        `https://apis.data.go.kr/B553766/psgr/getStnPsgr?serviceKey=${key}&pageNo=1&numOfRows=${totalCount}&type=json`
      )

      console.log('전체 데이터:', response.data)

      const items = response.data?.response?.body?.items?.item
      if (!items || items.length === 0) {
        setError('데이터가 없습니다.')
        return
      }

      console.log('첫번째 item 구조:', items[0])

      // 필드명 확인 후 아래 수정 필요
      const sorted = items
        .map((item) => {
          const keys = Object.keys(item)
          console.log('사용 가능한 필드:', keys)
          return item
        })
        .slice(0, 1) // 구조 확인 후 아래 정렬 로직으로 교체 예정

      setRanking(items.slice(0, 5)) // 임시 출력
    } catch (err) {
      setError('오류: ' + (err.message || '알 수 없는 오류'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">서울 지하철 승하차 인원 랭킹</h1>
        <p className="text-gray-500 mb-6 text-sm">승하차 인원이 가장 많은 역 TOP 5</p>

        {loading && <p className="text-gray-500">데이터 분석 중...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {ranking.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 mb-2">콘솔에서 필드명 확인 후 업데이트 예정</p>
            <pre className="text-xs text-gray-700 overflow-auto">
              {JSON.stringify(ranking[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
