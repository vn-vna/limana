import * as Bootstrap from 'react-bootstrap'
import * as BootstrapIcon from 'react-bootstrap-icons'


export default function AccountSideBar({ userData, onSaveChanges, setEditMode, editMode }) {
  return (
    <>
      <Bootstrap.Row>
        <Bootstrap.Col>
          <BootstrapIcon.PersonCircle size='200' />
        </Bootstrap.Col>
      </Bootstrap.Row>

      <Bootstrap.Row className="p-4">
        <Bootstrap.Col>
          <h1>
            <span>{[userData.firstname, userData.lastname].join(" ")}</span>
          </h1>
        </Bootstrap.Col>
      </Bootstrap.Row>

      <Bootstrap.Row className="d-flex justify-content-center">
        <Bootstrap.Col lg="6">
          <Bootstrap.Dropdown as={Bootstrap.ButtonGroup}>
            <Bootstrap.Button
              variant={editMode ? "outline-success" : "outline-primary"}
              onClick={() => {
                if (editMode) {
                  onSaveChanges()
                }

                setEditMode(!editMode)
              }}>{editMode ? "Save changes" : "Edit profile"}</Bootstrap.Button>

            <Bootstrap.Dropdown.Toggle split variant="outline-primary" />

            <Bootstrap.Dropdown.Menu>

              <Bootstrap.Dropdown.Header>Security actions</Bootstrap.Dropdown.Header>
              <Bootstrap.Dropdown.Item>Change email</Bootstrap.Dropdown.Item>
              <Bootstrap.Dropdown.Item>Change password</Bootstrap.Dropdown.Item>

              <Bootstrap.Dropdown.Divider />

              <Bootstrap.Dropdown.Header>Account actions</Bootstrap.Dropdown.Header>
              <Bootstrap.Dropdown.Item>Delete account</Bootstrap.Dropdown.Item>

            </Bootstrap.Dropdown.Menu>
          </Bootstrap.Dropdown>
        </Bootstrap.Col>
      </Bootstrap.Row>
    </>
  )
}