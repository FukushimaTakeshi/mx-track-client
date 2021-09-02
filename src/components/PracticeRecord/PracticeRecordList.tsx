import {
  Box,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../@types/models.d.ts'
import { apiClientWithAuth } from '../../lib/api_client'
import HandleFetch from '../Spinner/HandleFetch'
import Title from '../Title'
import PracticeRecord from './PracticeRecord'

const useStyles = makeStyles({
  table: { minWidth: 750 },
})

const StyledTableCell = withStyles({ root: { padding: '1.6em' } })(TableCell)

const PracticeRecordList: React.FC = () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [practiceRecords, setPracticeRecords] = useState<
    Models.PracticeRecord[]
  >([])
  useEffect(() => {
    fetchPracticeRecords()
  }, [])

  const fetchPracticeRecords = () => {
    setLoading(true)
    apiClientWithAuth
      .get('/practice_records/?sort=-practice_date')
      .then((res) => {
        setPracticeRecords(res.data)
        setLoading(false)
      })
    // TODO: エラー時
  }

  const [practiceRecord, setPracticeRecord] = useState<Models.PracticeRecord>(
    {} as Models.PracticeRecord
  )
  const [showPracticeRecord, setShowPracticeRecord] = useState(false)
  const showDetail = (practiceRecord: Models.PracticeRecord) => {
    setPracticeRecord(practiceRecord)
    setShowPracticeRecord(true)
  }
  const handleCloseDetail = () => {
    setShowPracticeRecord(false)
  }

  const handleDelete = (id: number) => {
    apiClientWithAuth.delete(`/practice_records/${id}`)
  }

  return (
    <>
      <Dialog
        open={showPracticeRecord}
        onClose={handleCloseDetail}
        fullWidth={true}
      >
        <PracticeRecord
          {...practiceRecord}
          onDelete={() => handleDelete(practiceRecord.id)}
          onClose={() => {
            fetchPracticeRecords()
            setShowPracticeRecord(false)
          }}
        ></PracticeRecord>
      </Dialog>
      <Title>activities</Title>

      <HandleFetch inner loading={loading}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>日付</TableCell>
                <TableCell align="right">コース</TableCell>
                <TableCell align="right">バイク</TableCell>
                <TableCell align="right">走行時間</TableCell>
                <TableCell align="right">メモ</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {practiceRecords.map((row) => (
                <TableRow key={row.id} onClick={() => showDetail(row)}>
                  <StyledTableCell component="th" scope="row">
                    {row.practiceDate}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.offRoadTrack.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.userVehicle.vehicle.modelName}
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
      </HandleFetch>
    </>
  )
}

export default PracticeRecordList
