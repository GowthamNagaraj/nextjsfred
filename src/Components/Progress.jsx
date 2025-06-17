import React from 'react'

const Progress = ({progressHidden}) => {
  return (
    <div hidden={progressHidden} className="absolute bg-[#00000021] top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <div className='border-8 border-sky-200 w-16 h-16 rounded-full border-t-8 border-t-sky-800 animate-spin'></div>
    </div>
  )
}

export default Progress
