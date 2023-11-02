import { useState } from 'react';

import * as Bootstrap from 'react-bootstrap';
import * as BootstrapIcon from 'react-bootstrap-icons';

export default function PasswordInput({ overlay, label, controlId, ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const overlayEl = (
    <Bootstrap.Tooltip>
      {overlay}
    </Bootstrap.Tooltip>
  )

  return (
    <Bootstrap.Form.Group className="mb-3">
      <Bootstrap.InputGroup>
        <Bootstrap.OverlayTrigger placement="top" overlay={overlayEl}>
          <Bootstrap.InputGroup.Text>
            <BootstrapIcon.Key />
          </Bootstrap.InputGroup.Text>
        </Bootstrap.OverlayTrigger>

        <Bootstrap.Form.FloatingLabel label={label ?? "Password"}>
          <Bootstrap.Form.Control type={showPassword ? "text" : "password"} placeholder="Password" {...props} />
        </Bootstrap.Form.FloatingLabel>

        <Bootstrap.Button variant="outline-secondary" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <BootstrapIcon.EyeSlash /> : <BootstrapIcon.Eye />}
        </Bootstrap.Button>

      </Bootstrap.InputGroup>
    </Bootstrap.Form.Group>
  )
}