import type { Meta } from "@storybook/react";
import styled from "styled-components";
import { EyeIcon, StarIcon, AttachmentIcon, HelperIcon, ErrorIcon, CancelIcon, LogoutIcon } from "../Icon";

function Layout() {
  return (
    <div>
      <Row>
        <EyeIcon />
        <StarIcon />
        <AttachmentIcon />
        <HelperIcon />
        <ErrorIcon />
        <CancelIcon />
        <LogoutIcon />
      </Row>
    </div>
  );
}

const Row = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const Story: Meta<typeof Layout> = {
  component: Layout,
  title: "Components/Icons",
};
export default Story;

export const Icons = {
  args: {},
};
