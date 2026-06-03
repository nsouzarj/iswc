---
name: skill-loteria
description: Specialized knowledge for the Mega-Sena lottery analytics dashboard project. Helps with data processing, dashboard functionality, and lottery-specific analysis.
---

# Skill-Loteria: Mega-Sena Lottery Analytics

This skill provides domain-specific knowledge for working with the Mega-Sena lottery analytics dashboard project. It covers the data pipeline, frontend functionality, and lottery-specific concepts.

## Project Overview

The Mega-Sena dashboard processes historical draw data from an Excel file and presents statistical analysis through an interactive web dashboard.

## Key Files and Their Purposes

### Backend (`process_lottery.py`)
- Reads Excel file: `D:\Dowloads\Mega-Sena.xlsx`
- Processes 2,991+ historical draws (6 numbers per draw)
- Computes ~15 statistical metrics including:
  - Frequency analysis
  - Pareto distribution
  - Delay tracking
  - Common pairs
  - Fibonacci patterns
  - And more
- Outputs: `lottery_stats.json`

### Frontend (`app.js`)
- Module-separation pattern: Bootstrap, Dashboard Init, Generator Module, Audit Module
- Fetches `lottery_stats.json` via `fetch()`
- Renders via DOM manipulation and Chart.js
- Bet generator with 5 strategies:
  1. Hot numbers
  2. Cold numbers
  3. Balanced
  4. Random
  5. Fibonacci-based
- Statistical auditing built-in

### Other Important Files
- `start_dashboard.py`: Python HTTP server on port 8000
- `index.html`: Dashboard UI
- `style.css`: Dark mode + glassmorphism styling
- `chart.min.js`: Chart.js bundled locally
- `check_cols.py`: Quick Excel column inspection
- `read_excel_peek.py`: Peek at Excel data

## Key Commands

```bash
# Process lottery data (reads Excel, generates lottery_stats.json)
python process_lottery.py

# Start the dashboard (HTTP server on localhost:8000)
python start_dashboard.py

# Quick Excel column inspection
python check_cols.py

# Peek at Excel data
python read_excel_peek.py
```

## Data Pipeline

1. Excel file (`D:\Dowloads\Mega-Sena.xlsx`) → `process_lottery.py`
2. `process_lottery.py` uses pandas + openpyxl to read and analyze data
3. Outputs `lottery_stats.json` with all statistics
4. Frontend (`app.js`) fetches and visualizes `lottery_stats.json`

## Architecture Notes

- No package managers, build tools, or bundlers
- Dependencies: `pip install pandas openpyxl` (not declared in any file)
- `lottery_stats.json` is committed as a generated artifact
- Frontend is entirely stateless client-side
- Chart.js is vendored locally (`chart.min.js`), not loaded from CDN
- No `.gitignore`-tracked `.xlsx` or `.csv` files — data files excluded from git

## Common Tasks

When working with this project, you might need to:

1. **Update data processing**: Modify `process_lottery.py` to add/change statistical metrics
2. **Enhance dashboard**: Update `app.js` for new visualizations or features
3. **Improve styling**: Modify `style.css` for better UI/UX
4. **Add new bet strategies**: Extend the Generator Module in `app.js`
5. **Fix data issues**: Use `check_cols.py` and `read_excel_peek.py` to debug Excel reading
6. **Optimize performance**: Improve algorithms in `process_lottery.py` for faster processing

## Lottery-Specific Concepts

- **Mega-Sena**: Brazilian national lottery where players choose 6 numbers from 1-60
- **Draw frequency**: How often each number appears
- **Delay**: How many draws since a number last appeared
- **Pairs/triples**: Common combinations of numbers that appear together
- **Fibonacci patterns**: Numbers that follow Fibonacci sequence patterns
- **Pareto distribution**: 80/20 analysis of number frequencies
- **Hot/Cold numbers**: Frequently vs infrequently drawn numbers
- **Balanced numbers**: Mix of high/low, odd/even numbers

## Troubleshooting

If the dashboard isn't showing updated data:
1. Run `python process_lottery.py` to regenerate `lottery_stats.json`
2. Check that the Excel file path is correct in `process_lottery.py`
3. Verify `lottery_stats.json` was updated (check timestamp)
4. Refresh the browser to load the updated JSON

If Excel reading fails:
1. Use `python check_cols.py` to see column structure
2. Use `python read_excel_peek.py` to view actual data
3. Ensure the Excel file exists at `D:\Dowloads\Mega-Sena.xlsx`

## Best Practices

- Keep the Excel file path centralized if it needs to change
- Maintain backward compatibility when updating statistical metrics
- Test new bet strategies with historical data
- Keep frontend dependencies minimal (no additional libraries)
- Ensure all statistics are explainable to users
- Preserve the dark mode + glassmorphism aesthetic in UI changes