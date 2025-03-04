// fe-piano-tutor/src/pages/Settings/Settings.tsx
import React, {useState} from 'react'
import {RootState, useAppSelector, useAppDispatch} from 'store'
import {updateLearnMusicNotesSettings} from 'store/slices/settingsSlice'
import {Form, InputNumber, Button} from 'antd'

const Settings: React.FC = () => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state: RootState) => state.settings.learnMusicNotes)
  const [localSettings, setLocalSettings] = useState(settings)

  const handleFormChange = (changedValues: any) => {
    setLocalSettings({...localSettings, ...changedValues})
  }

  const handleSave = () => {
    dispatch(updateLearnMusicNotesSettings(localSettings))
    console.log('Settings saved:', localSettings)
  }

  return (
    <div style={{padding: '20px'}}>
      <h1>Settings</h1>
      <h2>Music Theory</h2>
      <Form
        layout="vertical"
        initialValues={localSettings}
        onValuesChange={handleFormChange}
      >
        <Form.Item label="Number of Notes" name="NUMBER_OF_NOTES">
          <InputNumber min={1} max={20}/>
        </Form.Item>
        <Form.Item label="Default Level" name="DEFAULT_LEVEL">
          <InputNumber min={1} max={localSettings.MAX_LEVEL}/>
        </Form.Item>
        <Form.Item label="Max Level" name="MAX_LEVEL">
          <InputNumber min={1} max={20}/>
        </Form.Item>
        <Form.Item label="Note Duration" name="NOTE_DURATION">
          <InputNumber/>
        </Form.Item>
        <Form.Item label="Note Width" name="NOTE_WIDTH">
          <InputNumber min={10} max={100}/>
        </Form.Item>
        <Button type="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Form>
    </div>
  )
}

export default Settings
