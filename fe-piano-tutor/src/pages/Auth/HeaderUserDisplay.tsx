import React from 'react'
import {Link} from 'react-router-dom'
import {UserOutlined} from '@ant-design/icons'
import {useAppSelector} from 'store'

const HeaderUserDisplay: React.FC = () => {
  const {user} = useAppSelector((state) => state.auth)

  return user ? (
    <Link to="/auth/login" style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
      <UserOutlined style={{fontSize: '20px', color: '#fff'}}/>
      <span style={{marginLeft: '8px', fontSize: '16px', color: '#fff'}}>
        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
      </span>
    </Link>
  ) : (
    <Link to="/auth/login" style={{fontSize: '20px', color: '#fff'}}>
      <UserOutlined/>
    </Link>
  )
}

export default HeaderUserDisplay
