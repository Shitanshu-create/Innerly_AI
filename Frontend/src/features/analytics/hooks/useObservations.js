import { useMemo, useState, useEffect } from 'react';

const themeColors = ['text-sky-200', 'text-purple-200', 'text-sprout', 'text-canary', 'text-blush', 'text-mint', 'text-coral'];
const themeBackgrounds = ['bg-sky-200', 'bg-purple-200', 'bg-sprout', 'bg-canary', 'bg-blush', 'bg-mint', 'bg-coral'];

export function useObservations(insights) {
  const [expandedObservation, setExpandedObservation] = useState('Pattern');
  const [activeTheme, setActiveTheme] = useState(null);
  const [doneAdvice, setDoneAdvice] = useState([]);
  const [dismissedAdvice, setDismissedAdvice] = useState([]);

  const mapSizeToClass = (size, index) => {
    const textSize = size === 'xl' ? 'text-xl' : size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-sm' : '';
    return `${themeColors[index % themeColors.length]} ${textSize}`.trim();
  };

  const activeObservations = useMemo(() => {
    if (insights.observations && insights.observations.length > 0) {
      return insights.observations.map(o => [o.tag, o.text]);
    }
    return [];
  }, [insights.observations]);

  useEffect(() => {
    if (activeObservations.length > 0) {
      setExpandedObservation(activeObservations[0][0]);
    }
  }, [activeObservations]);

  const activeAdvice = useMemo(() => {
    if (insights.advices && insights.advices.length > 0) {
      return insights.advices.map(a => [a.category, a.title, a.body, a.action]);
    }
    return [];
  }, [insights.advices]);

  const activeThemes = useMemo(() => {
    if (insights.themes && insights.themes.length > 0) {
      return insights.themes.map((t, index) => ({
        label: t.label,
        freq: t.freq,
        className: mapSizeToClass(t.size, index),
        barClassName: themeBackgrounds[index % themeBackgrounds.length]
      }));
    }
    return [];
  }, [insights.themes]);

  useEffect(() => {
    if (activeThemes.length > 0 && !activeThemes.some(t => t.label === activeTheme)) {
      setActiveTheme(activeThemes[0].label);
    }
  }, [activeThemes, activeTheme]);

  const visibleAdvice = activeAdvice.filter((item) => !dismissedAdvice.includes(item[1]));

  return {
    activeObservations,
    activeAdvice,
    activeThemes,
    visibleAdvice,
    expandedObservation,
    setExpandedObservation,
    activeTheme,
    setActiveTheme,
    doneAdvice,
    setDoneAdvice,
    dismissedAdvice,
    setDismissedAdvice
  };
}
