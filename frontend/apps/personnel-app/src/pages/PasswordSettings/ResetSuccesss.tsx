
import { SuccessIcon } from "../../assets"
import { Flex, Typography } from "@local/shared-components"
import { Path } from "../../constants"
import { Link } from "react-router-dom"
import { Button, Image } from "antd-mobile"

export function ResetSuccesss() {
  return (
    <Flex direction="column" align="center" justify="center">
      <Image src={SuccessIcon} alt="Success Icon" height={100}  width={100} />
      <Typography variant="h3">Password Reset Successfully</Typography>
      <Typography variant="bodyMd">
        Your password has been reset successfully. Please login with your new password.
      </Typography>
      <Link to={Path.login}>
        <Button type="button" style={{ marginTop: "1rem" }} color="primary">
          Go to Login
        </Button>
      </Link>
    </Flex>
  )
}

