// fe-piano-tutor/src/pages/Settings/Settings.tsx
import React, {useState} from 'react'
import {RootState, useAppSelector, useAppDispatch} from 'store'
import {updateLearnMusicNotesSettings} from 'store/slices/settingsSlice'
import {Form, InputNumber, Button, notification} from 'antd'

const Settings: React.FC = () => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state: RootState) => state.settings.learnMusicNotes)
  const [localSettings, setLocalSettings] = useState(settings)

  const handleFormChange = (changedValues: any) => {
    setLocalSettings({...localSettings, ...changedValues})
  }

  const handleSave = async () => {
    try {
      // Dispatch returns a Promise when using Redux Toolkit
      await dispatch(updateLearnMusicNotesSettings(localSettings))

      // Show notification only after dispatch completes
      notification.success({
        message: 'Settings saved successfully'
      })
    } catch (error) {
      // Handle any errors during the save process
      notification.error({
        message: 'Failed to save settings',
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
  }

  return (
    <div style={{padding: '20px'}}>
      <h1>Settings</h1>
      <h2>1. Music Theory</h2>
      <h2>2. Learn Music Notes</h2>
      <Form
        layout="vertical"
        initialValues={localSettings}
        onValuesChange={handleFormChange}
      >
        <Form.Item label="Number of Notes" name="NUMBER_OF_NOTES">
          <InputNumber min={1} max={1000}/>
        </Form.Item>
        <Form.Item label="Default Level" name="DEFAULT_LEVEL">
          <InputNumber min={1} max={localSettings.MAX_LEVEL}/>
        </Form.Item>
        <Form.Item label="Max Level" name="MAX_LEVEL">
          <InputNumber min={1} max={7}/>
        </Form.Item>
        <Form.Item label="Note Duration (ms)" name="NOTE_DURATION">
          <InputNumber/>
        </Form.Item>
        <Form.Item label="Note Width" name="NOTE_WIDTH">
          <InputNumber min={10} max={100}/>
        </Form.Item>
        <Form.Item label="Tempo" name="TEMPO">
          <InputNumber min={30} max={200}/>
        </Form.Item>
        <Button type="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Form>
    </div>
  )
}

export default Settings
