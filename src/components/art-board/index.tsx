import { ArtBoardPlayer } from '@/components/remotion/Player';
import { useEditorSore } from '@/store';

export default function ArtBoard() {
  const allElements = useEditorSore((state) => state.elements);

  return (
    <>
      <div className='flex w-full h-full items-center justify-center rounded-sm'>
        <ArtBoardPlayer />
      </div>
    </>
  );
}
