import { ReactNode, useState } from 'react';
import { useTipStore } from '../../stores/tipStore';

interface Props {
  code: string;
  children: ReactNode;
  text: string;
}

export default function Tooltip({ code, children, text }: Props) {
  const { enabled } = useTipStore();
  const [show, setShow] = useState(false);

  return (
    <span style={{position:'relative'}} onMouseEnter={()=>enabled && setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show && (
        <span style={{
          position:'absolute',
          top:'100%',
          left:0,
          background:'#000',
          color:'#fff',
          padding:'4px 6px',
          fontSize:12,
          borderRadius:4,
          width:200,
          zIndex:20
        }}>{text}</span>
      )}
    </span>
  );
}