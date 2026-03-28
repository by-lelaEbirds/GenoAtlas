import React, { useRef, useState, useEffect } from 'react';
import GlobeVisualizer from './components/GlobeVisualizer';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import GameHUD from './components/GameHUD';
import { TutorialModal, AchievementsModal } from './components/Modals';
import { Trophy, Coins, Rocket, Film } from 'lucide-react';

import { useGeoGame } from './hooks/useGeoGame';
import { GAME_STATES, MAP_THEMES, GAME_MODES } from './constants';

export default function App() {
  const globeRef = useRef();
  const { state, actions } = useGeoGame(globeRef);
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full h-[100dvh] overflow-hidden select-none bg-white transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0 scale-105'}`}>
      
      <div className={`absolute inset-0 pointer-events-none z-10 transition-colors duration-200 ${state.screenFlash === 'success' ? 'bg-green-500/20' : state.screenFlash === 'error' ? 'bg-rose-500/20' : state.timeLeft <= 10 && state.gameState === GAME_STATES.PLAYING && !state.studyCard && state.gameMode !== GAME_MODES.STUDY ? 'shadow-[inset_0_0_100px_rgba(244,63,94,0.2)]' : ''}`} />

      {state.achievementToast && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[200] animate-fade-in-up w-max max-w-[90vw]">
          <div className="bg-amber-400 p-[3px] rounded-full shadow-lg">
            <div className="bg-white px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-3">
              <Trophy className="text-amber-500 animate-bounce-short" size={20} strokeWidth={2.5}/>
              <div>
                <p className="text-[10px] md:text-xs text-stone-400 font-black uppercase tracking-widest leading-none mb-1">Conquista Desbloqueada!</p>
                <p className="text-sm md:text-base font-black text-stone-800 leading-none truncate">{state.achievementToast.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.floatingPoints.map(point => (
        <div key={point.id} className={`absolute z-50 pointer-events-none animate-float-point text-2xl drop-shadow-md ${point.colorClass}`} style={{ left: point.x - 20, top: point.y - 40 }}>{point.text}</div>
      ))}

      {state.gameState !== GAME_STATES.START && (
        <GlobeVisualizer 
          ref={globeRef} geoData={state.geoData} onCountryClick={actions.handleCountryClick} 
          theme={state.activeTheme} gameState={state.gameState} guessedCountries={state.guessedCountries} 
          travelArcs={state.travelArcs} impactRings={state.impactRings} isMobile={state.isMobile} 
          isSmoothMode={state.isSmoothMode} 
        />
      )}
      
      {state.showTutorial && <TutorialModal onClose={actions.closeTutorial} />}
      {state.showAchievements && <AchievementsModal onClose={() => actions.setShowAchievements(false)} unlockedIds={state.unlockedAchievements} />}

      {state.showSettingsPrompt && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-stone-900/70 backdrop-blur-sm px-4 animate-fade-in-up">
          <div className="bg-white border-b-[6px] border-stone-200 p-6 md:p-8 pt-8 md:pt-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl relative">
            
            <h3 className="text-2xl md:text-3xl font-black text-stone-800 mb-2 text-center uppercase tracking-tighter">Estilo de Jogo</h3>
            <p className="text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 text-center">Como você prefere explorar?</p>
            
            <div className="flex flex-col gap-3 md:gap-4">
              <button onClick={() => actions.applySettings(false)} className="bg-sky-50 text-sky-900 p-3 md:p-4 rounded-2xl border-b-[5px] border-sky-200 flex items-center gap-3 md:gap-4 active:translate-y-[5px] active:border-b-0 transition-all text-left group">
                <div className="bg-white p-2 rounded-full text-sky-500 border-2 border-sky-100 shadow-inner group-hover:scale-110 transition-transform"><Rocket size={20} className="md:w-6 md:h-6" /></div>
                <div>
                  <div className="font-black uppercase tracking-widest text-xs md:text-sm whitespace-nowrap">Competitivo</div>
                  <div className="text-sky-700 text-[10px] font-bold mt-0.5 leading-tight">Para imediatamente. Alta performance.</div>
                </div>
              </button>

              <button onClick={() => actions.applySettings(true)} className="bg-green-50 text-green-900 p-3 md:p-4 rounded-2xl border-b-[5px] border-green-200 flex items-center gap-3 md:gap-4 active:translate-y-[5px] active:border-b-0 transition-all text-left group">
                <div className="bg-white p-2 rounded-full text-green-500 border-2 border-green-100 shadow-inner group-hover:scale-110 transition-transform"><Film size={20} className="md:w-6 md:h-6" /></div>
                <div>
                  <div className="font-black uppercase tracking-widest text-xs md:text-sm whitespace-nowrap">Cinematográfico</div>
                  <div className="text-green-700 text-[10px] font-bold mt-0.5 leading-tight">Desliza suavemente. Foco visual.</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {state.gameState === GAME_STATES.START && (
        <StartScreen 
          onStart={() => actions.startGame('normal')} 
          onStudy={() => actions.startGame('study')}
          onFootball={() => actions.startGame('football')} 
          onDaily={() => actions.startGame('daily')} 
          onOpenAchievements={() => actions.setShowAchievements(true)}
          onOpenTutorial={() => actions.setShowTutorial(true)}
          onOpenSettings={() => actions.setShowSettingsPrompt(true)}
          coins={state.coins}
          setCoins={actions.setCoins}
          currentTheme={state.activeTheme}
          setTheme={actions.setActiveTheme}
          themes={MAP_THEMES}
          unlockedThemes={state.unlockedThemes}
          setUnlockedThemes={actions.setUnlockedThemes}
          dailyCompleted={state.lastDailyDate === state.todayStr} 
        />
      )}
      
      {state.gameState === GAME_STATES.RESULT && (
        <ResultScreen 
          score={state.score} reason={state.endReason} bestScore={state.bestScore} 
          guessedCount={state.guessedCountries.length} 
          coinsEarned={state.lastCoinsEarned} 
          gameMode={state.gameMode} onRestart={() => actions.startGame(state.gameMode)} 
          onHome={() => { actions.quitGame(); actions.resetGlobe(); }} 
        />
      )}

      <GameHUD state={state} actions={actions} />
      
      {state.studyCard && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-900/80 px-4 animate-fade-in-up pointer-events-auto">
          <div className="bg-white border-b-[6px] border-stone-200 p-5 md:p-8 rounded-[2rem] max-w-sm w-full shadow-2xl relative pt-12 md:pt-16">
            
            <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2">
              <img 
                src={`https://flagcdn.com/w160/${state.studyCard.iso.toLowerCase()}.png`} 
                alt={`Bandeira`} 
                className="w-20 h-14 md:w-24 md:h-16 object-cover rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.1)] border-4 border-white bg-stone-100" 
              />
            </div>
            
            <div className="text-center mt-2">
              <h3 className="text-2xl md:text-3xl font-black text-stone-800 mb-1 tracking-tighter uppercase whitespace-nowrap">{state.studyCard.name}</h3>
              {!state.studyCard.isCorrect && ( <p className="text-xs md:text-sm text-rose-500 mb-4 font-black uppercase tracking-widest bg-rose-50 inline-block px-3 py-1.5 rounded-full border border-rose-100 whitespace-nowrap">Clicou em: {state.studyCard.clickedName}</p> )}
              {state.studyCard.isCorrect && ( <p className="text-xs md:text-sm text-green-600 mb-4 font-black uppercase tracking-widest bg-green-50 inline-block px-3 py-1.5 rounded-full border border-green-100 whitespace-nowrap">+{state.studyCard.pointsGained} Pontos!</p> )}

              <div className="flex flex-col gap-3 text-left bg-stone-50 rounded-2xl p-4 md:p-5 mb-5 border border-stone-100 shadow-inner">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <span className="text-stone-400 text-xs md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Capital</span>
                  <span className="text-stone-800 text-sm md:text-base font-bold whitespace-nowrap">{state.studyCard.capital}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400 text-xs md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Continente</span>
                  <span className="text-stone-800 text-sm md:text-base font-bold whitespace-nowrap">{state.studyCard.continent}</span>
                </div>
              </div>

              {(!state.studyCard.isCorrect && state.studyCard.livesRemaining <= 0 && state.gameMode !== GAME_MODES.DAILY) ? (
                <div className="flex gap-2 md:gap-3">
                  <button onClick={actions.dismissStudyCard} className="w-1/3 bg-stone-100 text-stone-500 py-3.5 md:py-4 rounded-2xl border-b-[5px] border-stone-200 font-black uppercase tracking-widest text-xs active:translate-y-[5px] active:border-b-0 transition-all hover:bg-stone-200 whitespace-nowrap">
                    Sair
                  </button>
                  <button onClick={actions.revive} disabled={state.coins < 100} className="w-2/3 bg-amber-400 text-amber-900 py-3.5 md:py-4 rounded-2xl border-b-[5px] border-amber-500 font-black uppercase tracking-widest text-xs flex justify-center items-center gap-1.5 active:translate-y-[5px] active:border-b-0 disabled:opacity-50 disabled:grayscale transition-all hover:bg-amber-500 whitespace-nowrap">
                    Reviver (100 <Coins size={14} className="md:w-4 md:h-4"/>)
                  </button>
                </div>
              ) : (
                <button onClick={actions.dismissStudyCard} className={`w-full py-3.5 md:py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:translate-y-[5px] active:border-b-0 transition-all whitespace-nowrap ${state.studyCard.isCorrect ? 'bg-green-500 text-white border-b-[5px] border-green-700 hover:bg-green-600' : 'bg-rose-500 text-white border-b-[5px] border-rose-700 hover:bg-rose-600'}`}>
                  Continuar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
