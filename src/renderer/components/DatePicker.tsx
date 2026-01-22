import React, { useState, useEffect } from 'react';
import { format, startOfMonth, setDate } from 'date-fns';

interface DatePickerProps {
  onDateChange: (date: Date) => void;
  initialDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange, initialDate }) => {
  const [date, setDateState] = useState<Date>(initialDate || new Date());
  const [monthYearOnly, setMonthYearOnly] = useState(false);

  useEffect(() => {
    let dateToUse = date;
    if (monthYearOnly) {
      // Set to first of the month when month/year only mode
      dateToUse = setDate(startOfMonth(date), 1);
      setDateState(dateToUse);
    }
    onDateChange(dateToUse);
  }, [date, monthYearOnly, onDateChange]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setDateState(newDate);
    }
  };

  const handleMonthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month] = e.target.value.split('-');
    const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    setDateState(newDate);
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem', color: 'var(--text)', fontSize: '1.2rem' }}>
        Select Date
      </h2>
      
      <div className="form-group">
        <div className="toggle">
          <input
            type="checkbox"
            id="monthYearOnly"
            checked={monthYearOnly}
            onChange={(e) => setMonthYearOnly(e.target.checked)}
          />
          <label htmlFor="monthYearOnly" style={{ cursor: 'pointer', margin: 0 }}>
            Month / Year only
          </label>
        </div>
      </div>

      <div className="form-group">
        {monthYearOnly ? (
          <>
            <label htmlFor="monthYear" className="label">
              Month and Year
            </label>
            <input
              type="month"
              id="monthYear"
              className="input"
              value={format(date, 'yyyy-MM')}
              onChange={handleMonthYearChange}
            />
          </>
        ) : (
          <>
            <label htmlFor="date" className="label">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="input"
              value={format(date, 'yyyy-MM-dd')}
              onChange={handleDateChange}
            />
          </>
        )}
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--hover)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
        Selected: <strong>{format(date, monthYearOnly ? 'MMMM yyyy' : 'MMMM d, yyyy')}</strong>
      </div>
    </div>
  );
};

export default DatePicker;
