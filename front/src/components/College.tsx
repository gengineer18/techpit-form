import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { TextField } from '@material-ui/core'

// 定数
import { PROFILE } from '../domain/services/profile'

// 型定義
import { RootState } from "../domain/entity/rootState"

// action
import { collegesActions } from "../store/colleges/actions"

import useStyles from './styles'

export const College = () => {
  const dispatch = useDispatch()
  const colleges = useSelector((state: RootState) => state.colleges)
  const classes = useStyles()

  const handleSearchWordChange = (name: string) => {
    dispatch(collegesActions.setSearchWord(name))
  }


  return (
    <>
      <TextField
        fullWidth
        className={classes.formField}
        label="大学名を検索"
        value={colleges.search}
        onChange={e => {handleSearchWordChange(e.target.value)}}
      />
    </>
  )
}
