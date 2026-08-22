import { useState } from "react";
import { Search, Button, Popover, PopoverContent, TextInput, Tag } from "@carbon/react";
import { Filter, ChevronDown, Close, Checkmark } from "@carbon/icons-react";
import "./list-filter-bar.scss";

export const ListFilterBar = ({
  searchPlaceholder = "Search...",
  filters = [],
  actionButton = null,
  searchValue = "",
  onSearchChange = () => {},
  onClearSearch = () => {},
  totalCount = null,
  activeFilterValues = {},
  onSelectFilter = () => {},
  onClearAllFilters = () => {},
}) => {
  const [activeFilterIndex, setActiveFilterIndex] = useState(null);
  const [filterSearchQuery, setFilterSearchQuery] = useState("");

  const handleToggleFilter = (index) => {
    if (activeFilterIndex === index) {
      setActiveFilterIndex(null);
      setFilterSearchQuery("");
    } else {
      setActiveFilterIndex(index);
      setFilterSearchQuery("");
    }
  };

  const activeFiltersCount = Object.keys(activeFilterValues).filter(
    (k) => activeFilterValues[k]
  ).length;

  return (
    <div className="carbon-list-filter-bar">
      {/* Top Row: Search, Item Count, and Action */}
      <div className="filter-bar-top-row">
        <div className="search-and-count-wrap">
          <div className="filter-search-wrap">
            <Search
              size="md"
              id="list-filter-search"
              placeholder={searchPlaceholder}
              labelText="Search table"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={onClearSearch}
            />
          </div>

          {totalCount !== null && (
            <Tag type="cool-gray" size="md" className="total-count-tag">
              {totalCount} total results
            </Tag>
          )}
        </div>

        <div className="filter-bar-action">
          {actionButton}
        </div>
      </div>

      {/* Bottom Row: Quick Filters & Active Pills */}
      {filters.length > 0 && (
        <div className="filter-bar-bottom-row">
          <div className="filter-dropdowns-group">
            <span className="filter-label-prefix">
              <Filter size={16} /> Filters:
            </span>

            {filters.map((filter, index) => {
              const isOpen = activeFilterIndex === index;
              const selectedValue = activeFilterValues[filter.label];
              const filteredOptions = (filter.options || []).filter((opt) =>
                opt.label.toLowerCase().includes(filterSearchQuery.toLowerCase())
              );

              return (
                <div key={index} className="filter-popover-item">
                  <Popover
                    open={isOpen}
                    align="bottom-left"
                    onRequestClose={() => setActiveFilterIndex(null)}
                  >
                    <button
                      type="button"
                      className={`filter-dropdown-btn ${isOpen ? "open" : ""} ${selectedValue ? "has-value" : ""}`}
                      onClick={() => handleToggleFilter(index)}
                      aria-expanded={isOpen}
                    >
                      <span>{filter.label}</span>
                      {selectedValue && (
                        <span className="selected-val-badge">
                          : {selectedValue}
                        </span>
                      )}
                      <ChevronDown size={14} />
                    </button>

                    <PopoverContent className="filter-dropdown-popover">
                      <div className="popover-filter-header">
                        <span className="popover-filter-title">Filter by {filter.label.toLowerCase()}</span>
                      </div>
                      <div className="popover-filter-search">
                        <TextInput
                          id={`filter-input-${index}`}
                          labelText={`Filter ${filter.label}`}
                          hideLabel
                          placeholder={`Search ${filter.label}...`}
                          size="sm"
                          value={filterSearchQuery}
                          onChange={(e) => setFilterSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="popover-filter-options">
                        {filteredOptions.length === 0 ? (
                          <div className="no-options-found">No options found</div>
                        ) : (
                          filteredOptions.map((opt, idx) => {
                            const isSelected = selectedValue === opt.label;
                            return (
                              <button
                                key={idx}
                                type="button"
                                className={`filter-option-item ${isSelected ? "selected" : ""}`}
                                onClick={() => {
                                  onSelectFilter(filter.label, isSelected ? null : opt.label);
                                  opt.onClick?.();
                                  setActiveFilterIndex(null);
                                }}
                              >
                                {opt.color && (
                                  <span
                                    className="option-color-dot"
                                    style={{ backgroundColor: opt.color }}
                                  />
                                )}
                                <span className="option-label-text">{opt.label}</span>
                                {isSelected && <Checkmark size={14} className="option-check-icon" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}
          </div>

          {activeFiltersCount > 0 && (
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Close}
              onClick={onClearAllFilters}
              className="clear-all-filters-btn"
            >
              Clear filters ({activeFiltersCount})
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
