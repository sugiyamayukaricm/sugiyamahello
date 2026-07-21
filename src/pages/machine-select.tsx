import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { type Machine, machines } from '@/lib/data';

export function MachineSelect() {
  const navigate = useNavigate();
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const selectedMachineName = useMemo(() => {
    return selectedMachine?.name ?? '機械を選択';
  }, [selectedMachine]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex h-[52px] items-center bg-[#37474F] px-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex flex-col font-medium text-[10px] text-white/70 uppercase tracking-[0.2em]">
            <span>LOTTE</span>
            <span>雪見だいふくライン</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-sm tracking-[0.2em]">
            <span>Meister</span>
            <span>DNA</span>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-52px)] flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl text-center">
          <h1 className="font-semibold text-3xl text-gray-900">
            今日使う機械を選んでください
          </h1>
          <p className="mt-3 text-base text-gray-600">
            作業を始める前に確認してください
          </p>
        </div>

        <div className="mt-10 grid w-full max-w-[820px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {machines.map((machine) => {
            const isSelected = selectedMachine?.id === machine.id;

            return (
              <button
                key={machine.id}
                type="button"
                onClick={() => setSelectedMachine(machine)}
                className={`flex min-h-[168px] flex-col items-center justify-center rounded-2xl border p-6 text-center transition-all duration-200 ${
                  isSelected
                    ? 'border-[#E60012] bg-[#FFEBEE] shadow-[0_0_0_2px_rgba(230,0,18,0.2)]'
                    : 'border-gray-300 bg-white hover:border-[#E60012] hover:bg-[#FFEBEE]'
                }`}
              >
                <div className="text-4xl">{machine.icon}</div>
                <div className="mt-4 font-semibold text-gray-900">
                  {machine.name}
                </div>
                <div className="mt-1 text-gray-600 text-sm">{machine.area}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex w-full max-w-[820px] flex-col items-center gap-3">
          <div className="text-gray-500 text-sm">
            選択中:{' '}
            <span className="font-semibold text-gray-900">
              {selectedMachineName}
            </span>
          </div>
          <Button
            size="lg"
            className="w-full max-w-[280px] rounded-full bg-[#E60012] text-white hover:bg-[#B0000D] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            disabled={!selectedMachine}
            onClick={() => {
              if (selectedMachine) {
                navigate('/home', { state: { machine: selectedMachine } });
              }
            }}
          >
            この機械で始める
          </Button>
        </div>
      </main>
    </div>
  );
}
