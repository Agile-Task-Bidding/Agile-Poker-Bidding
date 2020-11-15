import React, { useState } from 'react'
import ResponsiveContainer from '../../components/ResponsiveContainer'
import EditArea from './EditArea'
import { StyleSheet, css } from 'aphrodite'
import '..//Styling.css'

const CreatePage = () => {
  return (
    <div className={css(styles.container)}>
      <EditArea />
    </div>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    padding: 15,
    display: 'flex',
    justifyContent: 'center',
    background:
      'radial-gradient(circle, rgba(234,243,253,1) 0%, rgba(44,90,201,1) 100%)',
  },
})

export default CreatePage
