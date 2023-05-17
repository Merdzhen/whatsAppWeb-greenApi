import React from "react";
import styles from './Input.module.scss'

export default function Input({ value, setValue, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles.input}
      placeholder={placeholder}
    />
  );
}
