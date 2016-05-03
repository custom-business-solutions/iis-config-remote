// var ipcRenderer = window.require('electron').ipcRenderer

import React from 'react'
import Header from './Header'
import ConfigContainer from './ConfigContainer'

import '../../sass/main.scss'

const MainContainer = () => {
  return (
    <div>
      <Header />
      <ConfigContainer />
    </div>
  )
}

export default MainContainer
