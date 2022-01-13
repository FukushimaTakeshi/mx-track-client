import { Box } from '@mui/material'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Dashboard } from '../templates/Dashboard'

const Information = (markdown: string): JSX.Element => {
  return (
    <Dashboard>
      <Box p={1}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </Box>
    </Dashboard>
  )
}

export default Information
