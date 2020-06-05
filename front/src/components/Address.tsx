import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { TextField } from '@material-ui/core'

// 定数
import { PROFILE } from '../domain/services/profile'
import { isPostalcode } from "../domain/services/address"

// 型定義
import { RootState } from "../domain/entity/rootState"
import { Address as IAddress } from "../domain/entity/address";

// action
import { profileActions } from "../store/profile/actions";

import useStyles from './styles'

export const Address = () => {
  const dispatch = useDispatch()
  const profile = useSelector((state: RootState) => state.profile)
  const classes = useStyles()

  const handleAddressChange = (member: Partial<IAddress>) => {
    dispatch(profileActions.setAddress(member))
  }

  const handlePostalcodeChange = (postalcode: string) => {
    if(!isPostalcode(postalcode)) return
    dispatch(profileActions.setAddress({ postalcode: postalcode }))
  }

  return (
    <>
      <TextField
        fullWidth
        className={classes.formField}
        label={PROFILE.ADDRESS.POSTALCODE}
        value={profile.address.postalcode}
        onChange={e => {handlePostalcodeChange(e.target.value)}}
      />
      <TextField
        fullWidth
        className={classes.formField}
        label={PROFILE.ADDRESS.PREFECTURE}
        value={profile.address.prefecture}
        onChange={e => {handleAddressChange({ prefecture: e.target.value })}}
      />
      <TextField
        fullWidth
        className={classes.formField}
        label={PROFILE.ADDRESS.CITY}
        value={profile.address.city}
        onChange={e => {handleAddressChange({ city: e.target.value })}}
      />
      <TextField
        fullWidth
        className={classes.formField}
        label={PROFILE.ADDRESS.RESTADDRES}
        value={profile.address.restAddress}
        onChange={e => {handleAddressChange({ restAddress: e.target.value })}}
      />
    </>
  )
}
