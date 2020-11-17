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
  },
})

export default CreatePage
