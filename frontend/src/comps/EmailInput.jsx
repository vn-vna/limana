import { useState } from 'react';
import * as Bootstrap from 'react-bootstrap';
import * as BootstrapIcon from 'react-bootstrap-icons';

export default function EmailInput({ overlay, label, ...props }) {
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
            <BootstrapIcon.Envelope />
          </Bootstrap.InputGroup.Text>
        </Bootstrap.OverlayTrigger>
        <Bootstrap.Form.FloatingLabel label={label ?? "Email"}>
          <Bootstrap.Form.Control type="email" placeholder="Enter email" {...props} />
        </Bootstrap.Form.FloatingLabel>
      </Bootstrap.InputGroup>
    </Bootstrap.Form.Group>
  )
}