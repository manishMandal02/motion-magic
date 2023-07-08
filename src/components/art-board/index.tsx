import { ArtBoardPlayer } from '@/components/remotion/Player';
import { useEditorStore } from '@/store';

export default function ArtBoard() {
  const allElements = useEditorStore(state => state.elements);

  return (
    <>
      <div className='flex w-full h-full items-center justify-center rounded-sm'>
        <ArtBoardPlayer />
      </div>
    </>
  );
}
