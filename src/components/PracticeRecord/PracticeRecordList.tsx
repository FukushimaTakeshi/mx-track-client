import EditIcon from '@mui/icons-material/Edit'
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
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import withStyles from '@mui/styles/withStyles'
import { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../@types/models.d.ts'
import { apiClientWithAuth } from '../../lib/api_client'
import { Resource } from '../../lib/resource'
import PracticeRecord from './PracticeRecord'

const useStyles = makeStyles({
  table: { minWidth: 750 },
})

const StyledTableCell = withStyles({ root: { padding: '1.6em' } })(TableCell)

type Props = {
  resource: Resource<AxiosResponse<Models.PracticeRecord[]>> | null
  reloadResource: () => void
}

const PracticeRecordList: React.FC<Props> = ({ resource, reloadResource }) => {
  const classes = useStyles()
  const practiceRecords = resource?.read().data

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
            setShowPracticeRecord(false)
            reloadResource()
          }}
        ></PracticeRecord>
      </Dialog>

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
            {practiceRecords &&
              practiceRecords.map((row) => (
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
    </>
  )
}

export default PracticeRecordList
