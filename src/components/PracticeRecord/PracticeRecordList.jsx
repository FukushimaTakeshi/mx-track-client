import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClientWithAuth } from '../../lib/api_client'
import InnerLoading from '../InnerLoading'

const useStyles = makeStyles({
  table: { minWidth: 650 },
})

const StyledTableCell = withStyles({ root: { padding: '1.6em' } })(TableCell)

const PracticeRecordList = () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [practiceRecords, setPracticeRecords] = useState([])
  useEffect(() => {
    setLoading(true)
    apiClientWithAuth
      .get('/practice_records/?sort=-practice_date')
      .then((res) => {
        setPracticeRecords(res.data)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Toolbar>
        <Typography color="textSecondary" variant="subtitle1" component="div">
          activities
        </Typography>
      </Toolbar>
      <InnerLoading loading={loading}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>日付</TableCell>
                <TableCell align="right">コース</TableCell>
                <TableCell align="right">走行時間</TableCell>
                <TableCell align="right">メモ</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {practiceRecords.map((row) => (
                <TableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.practiceDate}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.offRoadTrack.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{`${row.hours}時間${row.minutes}分`}</StyledTableCell>
                  <StyledTableCell align="right">
                    <div style={{ width: 70 }}>
                      <Box
                        component="div"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        bgcolor="background.paper"
                        whiteSpace="nowrap"
                      >
                        {row.memo}
                      </Box>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Link key={row.id} to={`practice_records/${row.id}`}>
                      <EditIcon color="disabled" fontSize="small" />
                    </Link>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </InnerLoading>
    </>
  )
}

export default PracticeRecordList
