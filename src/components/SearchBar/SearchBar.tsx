import React from "react";
import type { ChangeEvent } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  filter: string;
  setFilter: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  filter,
  setFilter,
  onSearch,
  onClear,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск по имени или описанию..."
          value={filter}
          onChange={handleChange}
          className={styles.filterInput}
        />
        <button onClick={onSearch} className={styles.searchButton}>
          Поиск
        </button>
        <button onClick={onClear} className={styles.clearButton}>
          Очистить
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
