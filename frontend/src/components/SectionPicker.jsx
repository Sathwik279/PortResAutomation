import { sectionLabels } from "../data/defaultConfig";

export default function SectionPicker({ title, settings, onChange }) {
  const entries = Object.entries(settings.sections).sort(([, first], [, second]) => first.order - second.order);

  function toggle(section) {
    onChange({
      ...settings,
      sections: {
        ...settings.sections,
        [section]: {
          ...settings.sections[section],
          enabled: !settings.sections[section].enabled
        }
      }
    });
  }

  function move(section, direction) {
    const sorted = entries.map(([key]) => key);
    const currentIndex = sorted.indexOf(section);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= sorted.length) {
      return;
    }
    const nextOrder = [...sorted];
    const [picked] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(nextIndex, 0, picked);

    onChange({
      ...settings,
      sections: Object.fromEntries(nextOrder.map((key, index) => [
        key,
        {
          ...settings.sections[key],
          order: index + 1
        }
      ]))
    });
  }

  return (
    <aside className="section-picker">
      <h2>{title}</h2>
      <div className="section-list">
        {entries.map(([section, options], index) => (
          <div className="section-row" key={section}>
            <label>
              <input
                type="checkbox"
                checked={options.enabled}
                onChange={() => toggle(section)}
              />
              {sectionLabels[section] || section}
            </label>
            <div className="move-actions">
              <button type="button" onClick={() => move(section, -1)} disabled={index === 0}>
                Up
              </button>
              <button type="button" onClick={() => move(section, 1)} disabled={index === entries.length - 1}>
                Down
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
