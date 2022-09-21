import React from 'react';

export default function SmallSpinner({style}) {
  return (
        <div style={style} className="lds-ellipsis small"><div></div><div></div><div></div><div></div></div>
  )
}