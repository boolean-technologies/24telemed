import type { Meta } from "@storybook/react";
import styled from "styled-components";
import { EyeIcon } from "./Icons/EyeIcon";
import { StarIcon } from "./Icons/StarIcon";
import { AttachmentIcon } from "./Icons/AttachmentIcon";
import {HelperIcon} from './Icons/HelperIcon';
function Layout() {
  return (
    <div>
      <Row>
        <EyeIcon />
        <StarIcon />
        <AttachmentIcon />
        <HelperIcon />
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
  title: "Design System/Icons",
};
export default Story;

export const Icons = {
  args: {},
};
