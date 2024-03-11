import { Popup } from 'antd-mobile';

type BottomSheetProps = {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  content: React.ReactNode;
};

const BottomSheet: React.FC<BottomSheetProps> = ({
  setVisible,
  visible,
  content,
}) => {
  return (
    <Popup
      visible={visible}
      onClose={() => setVisible(false)}
      bodyStyle={{ height: '40vh' }}
      onMaskClick={() => setVisible(false)}
    >
      {content}
    </Popup>
  );
};

export default BottomSheet;
