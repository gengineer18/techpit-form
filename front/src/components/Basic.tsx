import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormHelperText
} from '@material-ui/core'

// 型定義
import { RootState } from "../domain/entity/rootState"
import { Profile } from "../domain/entity/profile"
import { Gender } from '../domain/entity/gender'

// 定数
import { PROFILE } from '../domain/services/profile'

import { calculateValidation } from "../domain/services/validation";

// action
import { profileActions } from "../store/profile/actions"
import validationActions from "../store/validation/actions";

// css
import useStyles from './styles'

export const Basic = () => {
  const dispatch = useDispatch()
  const profile = useSelector((state: RootState) => state.profile)
  const validation = useSelector((state: RootState) => state.validation);
  const classes = useStyles()

  const handleChange = (member: Partial<Profile>) => {
    dispatch(profileActions.setProfile(member))
    recalculateValidation(member);
  }

  const recalculateValidation = (member: Partial<Profile>) => {
    // バリデーションのエラーを表示し始めてたらメッセージを計算して更新
    if (!validation.isStartValidation) return;

    const newProfile = {
      ...profile,
      ...member
    }
    const message = calculateValidation(newProfile)
    dispatch(validationActions.setValidation(message))
  }

  return (
    <>
      <TextField
        fullWidth
        className={classes.formField}
        label={PROFILE.NAME}
        value={profile.name}
        required
        error={!!validation.message.name}
        helperText={validation.message.name}
        onChange={e => handleChange({name: e.target.value})}
      />
      <TextField
        fullWidth
        multiline
        className={classes.formField}
        rows={5}
        label={PROFILE.DESCRIPTION}
        value={profile.description}
        error={!!validation.message.description}
        helperText={validation.message.description}
        onChange={e => handleChange({description: e.target.value})}
      />
      <FormControl
        className={classes.formField}
        error={!!validation.message.gender}
        required
      >
        <FormLabel>{PROFILE.GENDER}</FormLabel>
        <RadioGroup
          value={profile.gender}
          onChange={e => handleChange({gender: e.target.value as Gender})}
        >
          <FormControlLabel
            value="male"
            label="男性"
            control={<Radio color="primary" />}
          />
          <FormControlLabel
            value="female"
            label="女性"
            control={<Radio color="primary" />}
          />
        </RadioGroup>
        <FormHelperText>{validation.message.gender}</FormHelperText>
      </FormControl>
      <TextField
        fullWidth
        required
        error={!!validation.message.birthday}
        helperText={validation.message.birthday}
        className={classes.formField}
        label={PROFILE.BIRTHDAY}
        type="date"
        value={profile.birthday}
        onChange={e => handleChange({ birthday: e.target.value })}
        InputLabelProps={{
          shrink: true
        }}
      />
    </>
  )
}
