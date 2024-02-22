import React from 'react'

const SearchList = ({list,setSelected}) => {
  
  return (
<div className="">
{list.map((item,index)=>{
    <div onClick={(setSelected(item))} key={index}>
        {item}
    </div>
})}



</div>
  )
}

export default SearchList