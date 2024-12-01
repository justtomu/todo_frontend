import { FC, useEffect, useState } from 'react';
import { Input, InputProps, Spin } from 'antd';
import styles from './SimpleEditableText.module.scss';

import { Exists } from '@utils';

interface Props {
  initialValue: string;
  isEditable?: boolean;
  isEditing?: boolean;
  onCommit: (value: string) => Promise<string>;
  inputProps?: InputProps;
}

export const SimpleEditableText: FC<Props> = (props: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(props.isEditing || false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [text, setText] = useState<string>(props.initialValue);

  const onTextChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setText(target.value);
  };

  useEffect(() => {
    if (text !== props.initialValue) {
      setText(props.initialValue);
      setIsEditing(false);
    }
  }, [props.initialValue]);

  const onCommit = async () => {
    setIsError(false);
    setIsEditing(false);
    if (text === props.initialValue) return;
    setIsWaiting(true);

    try {
      setText(await props.onCommit(text));
    } catch {
      setIsError(true);
    }
    setIsWaiting(false);
  };

  const onTextClick = () => {
    if (props.isEditable !== false) setIsEditing(true);
  };

  if (isWaiting) {
    return <Spin size="small" />;
  } else if (isEditing) {
    return (
      <Input
        {...props.inputProps}
        size="small"
        autoFocus={true}
        defaultValue={text}
        onChange={onTextChange}
        onPressEnter={onCommit}
        onBlur={onCommit}
      />
    );
  } else {
    return (
      <span className={styles.simpleText} onClick={onTextClick}>
        <Exists visible={isError}>
          <span className={styles.error}>�</span>
        </Exists>
        {text || String.fromCharCode(160)}
      </span>
    );
  }
};
