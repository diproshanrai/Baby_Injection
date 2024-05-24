import { Skeleton } from 'antd'
import React from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
export default function View() {
  const {id} = useParams()
  const {data,error,loading} = useFetch(`vaccine-list/${id}`)
  if(loading) return <Skeleton />
  if(error) return <span className="text-danger">{error.message}</span>
  return(
      <div className="container py-2">
          <h1 className='py-2'>{data.data.name}</h1>
          <h2 className='py-2'>Recommended at: {data.data.months} Month(s)</h2>
          <p className="py-2">
                {data.data.description}
          </p>
      </div>
  )
}
