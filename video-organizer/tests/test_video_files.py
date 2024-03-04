import os
from unittest.mock import patch
from unittest.mock import PropertyMock
import pytest

from src.video_files import VideoFiles

@patch('src.video_files.VideoFiles.parse_video_files')
@patch('src.video_files.VideoFiles.get_video_files')
def test_init(mock_parse_video_files, mock_get_video_files):
    video_files = VideoFiles('/path/to/directory')
    assert video_files.path == '/path/to/directory'
    mock_get_video_files.assert_called_once()
    mock_parse_video_files.assert_called_once()


@pytest.fixture
def video_files():
    with patch('os.listdir') as mock_listdir:
        mock_listdir.return_value = ['movie_2022_.mp4', 'series_S01E01.mp4', 'image.jpg', 'multi_word_file_name.mp4',
                                     'series_S10E10.mp4','series_S21E21.mp4','invalid_file.mp4', 'multi_word_file_name_1234.mp4']
        return VideoFiles('/path/to/directory')

def test_is_video_file(video_files):
    assert video_files.is_video_file('video.mp4') == True
    assert video_files.is_video_file('image.jpg') == False
    assert video_files.is_video_file('video.mkv') == True
    assert video_files.is_video_file('video.avi') == True
    assert video_files.is_video_file('video.flv') == True
    assert video_files.is_video_file('video.ts') == True
    assert video_files.is_video_file('video.mkv.jpg') == False
    assert video_files.is_video_file('video') == False
    assert video_files.is_video_file('video.') == False
    assert video_files.is_video_file('.mp4') == False
    assert video_files.is_video_file('video.mp4.') == False

def test_parse_video_file(video_files):
    assert video_files.parse_video_file('movie_2022_.mp4') == os.path.normpath('Movies/movie (2022)/movie_2022_.mp4')
    assert video_files.parse_video_file('series_S01E01.mp4') == os.path.normpath('Series/series ( - )/Season 1/series_S01E01.mp4')
    assert video_files.parse_video_file('series_S10E10.mp4') == os.path.normpath('Series/series ( - )/Season 10/series_S10E10.mp4')
    assert video_files.parse_video_file('series_S21E21.mp4') == os.path.normpath('Series/series ( - )/Season 21/series_S21E21.mp4')
    assert video_files.parse_video_file('invalid_file.mp4') == None
    assert video_files.parse_video_file('multi_word_file_name.mp4') == None
    assert video_files.parse_video_file('multi_word_file_name_1234.mp4') == os.path.normpath('Movies/multi word file name (1234)/multi_word_file_name_1234.mp4')
    assert video_files.parse_video_file('Top_Gear_S23E06_1080p_BluRay_30nama_30NAMA.mkv') == os.path.normpath('Series/Top Gear ( - )/Season 23/\Top_Gear_S23E06_1080p_BluRay_30nama_30NAMA.mkv')


def test_parse_video_files(video_files):
    print(video_files.video_files)
    print('parse_video_files')
    print(video_files.parse_video_files())
    assert video_files.parse_video_files() == [
        ('movie_2022_.mp4', os.path.normpath('Movies/movie (2022)/movie_2022_.mp4')),
        ('series_S01E01.mp4', os.path.normpath('Series/series ( - )/Season 1/series_S01E01.mp4')),
        ('multi_word_file_name.mp4', None),
        ('series_S10E10.mp4', os.path.normpath('Series/series ( - )/Season 10/series_S10E10.mp4')),
        ('series_S21E21.mp4', os.path.normpath('Series/series ( - )/Season 21/series_S21E21.mp4')),
        ('invalid_file.mp4', None),
        ('multi_word_file_name_1234.mp4', os.path.normpath('Movies/multi word file name (1234)/multi_word_file_name_1234.mp4'))
    ]

@patch('os.listdir')
def test_get_video_files(mock_listdir, video_files):
    mock_listdir.return_value = ['movie_2022_.mp4', 'series_S01E01.mp4', 'image.jpg', 'multi_word_file_name.mp4']
    assert video_files.get_video_files() == ['movie_2022_.mp4', 'series_S01E01.mp4', 'multi_word_file_name.mp4']

def test_get_video_files_empty(video_files):
    with patch('os.listdir') as mock_listdir:
        mock_listdir.return_value = []
        assert video_files.get_video_files() == []

def test_get_video_files_no_video_files(video_files):
    with patch('os.listdir') as mock_listdir:
        mock_listdir.return_value = ['image.jpg']
        assert video_files.get_video_files() == []


def test_organize_files_with_parsed_paths(video_files):
    with patch('os.renames') as mock_renames:
        video_files.parsed_video_files = [
            ('movie_2022_.mp4', 'Movies/movie (2022)/movie_2022_.mp4'),
            ('series_S01E01.mp4', 'Series/series ( - )/Season 1/series_S01E01.mp4'),
            ('multi_word_file_name.mp4', None),
            ('series_S10E10.mp4', 'Series/series ( - )/Season 10/series_S10E10.mp4'),
            ('series_S21E21.mp4', 'Series/series ( - )/Season 21/series_S21E21.mp4'),
            ('invalid_file.mp4', None),
            ('multi_word_file_name_1234.mp4', 'Movies/multi word file name (1234)/multi_word_file_name_1234.mp4')
        ]
        video_files.organize_files()
        
        assert mock_renames.call_count == 5
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'movie_2022_.mp4'),
            os.path.join(video_files.path, 'Movies/movie (2022)/movie_2022_.mp4')
        )
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'series_S01E01.mp4'),
            os.path.join(video_files.path, 'Series/series ( - )/Season 1/series_S01E01.mp4')
        )
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'series_S10E10.mp4'),
            os.path.join(video_files.path, 'Series/series ( - )/Season 10/series_S10E10.mp4')
        )
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'series_S21E21.mp4'),
            os.path.join(video_files.path, 'Series/series ( - )/Season 21/series_S21E21.mp4')
        )
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'multi_word_file_name_1234.mp4'),
            os.path.join(video_files.path, 'Movies/multi word file name (1234)/multi_word_file_name_1234.mp4')
        )


def test_organize_files_with_no_parsed_paths(video_files):
    with patch('os.renames') as mock_renames:
        video_files.parsed_video_files = [
            ('movie_2022_.mp4', None),
            ('series_S01E01.mp4', None),
            ('multi_word_file_name.mp4', None),
            ('series_S10E10.mp4', None),
            ('series_S21E21.mp4', None),
            ('invalid_file.mp4', None),
            ('multi_word_file_name_1234.mp4', None)
        ]
        video_files.organize_files()
        mock_renames.assert_not_called()
        

def test_organize_files_with_existing_paths(video_files):
    with patch('os.renames') as mock_renames:
        video_files.parsed_video_files = [
            ('movie_2022_.mp4', 'Movies/movie (2022)/movie_2022_.mp4'),
            ('series_S01E01.mp4', 'Series/series ( - )/Season 1/series_S01E01.mp4'),
            ('multi_word_file_name.mp4', None),
            ('series_S10E10.mp4', 'Series/series ( - )/Season 10/series_S10E10.mp4'),
            ('series_S21E21.mp4', 'Series/series ( - )/Season 21/series_S21E21.mp4'),
            ('invalid_file.mp4', None),
            ('multi_word_file_name_1234.mp4', 'Movies/multi word file name (1234)/multi_word_file_name_1234.mp4')
        ]
        with patch('os.path.exists') as mock_exists:
            mock_exists.return_value = True
            video_files.organize_files()
            mock_renames.assert_not_called()


def test_revert_changes(video_files):
    with patch('os.renames') as mock_renames:
        video_files.parsed_video_files = [
            ('movie_2022_.mp4', 'Movies/movie (2022)/movie_2022_.mp4'),
            ('series_S01E01.mp4', 'Series/series ( - )/Season 1/series_S01E01.mp4'),
            ('multi_word_file_name.mp4', None),
            ('series_S10E10.mp4', 'Series/series ( - )/Season 10/series_S10E10.mp4'),
            ('series_S21E21.mp4', 'Series/series ( - )/Season 21/series_S21E21.mp4'),
            ('invalid_file.mp4', None),
            ('multi_word_file_name_1234.mp4', 'Movies/multi word file name (1234)/multi_word_file_name_1234.mp4')
        ]
        video_files.revert_changes()
        
        assert mock_renames.call_count == 5
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'Movies/movie (2022)/movie_2022_.mp4'),
            os.path.join(video_files.path, 'movie_2022_.mp4')
        )
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'Series/series ( - )/Season 1/series_S01E01.mp4'),
            os.path.join(video_files.path, 'series_S01E01.mp4')
        )
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'Series/series ( - )/Season 10/series_S10E10.mp4'),
            os.path.join(video_files.path, 'series_S10E10.mp4')
        )
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'Series/series ( - )/Season 21/series_S21E21.mp4'),
            os.path.join(video_files.path, 'series_S21E21.mp4')
        )
        mock_renames.assert_any_call(
            os.path.join(video_files.path, 'Movies/multi word file name (1234)/multi_word_file_name_1234.mp4'),
            os.path.join(video_files.path, 'multi_word_file_name_1234.mp4'))


def test_revert_changes_with_no_parsed_paths(video_files):
    with patch('os.renames') as mock_renames:
        video_files.parsed_video_files = [
            ('movie_2022_.mp4', None),
            ('series_S01E01.mp4', None),
            ('multi_word_file_name.mp4', None),
            ('series_S10E10.mp4', None),
            ('series_S21E21.mp4', None),
            ('invalid_file.mp4', None),
            ('multi_word_file_name_1234.mp4', None)
        ]
        video_files.revert_changes()
        mock_renames.assert_not_called()


def test_revert_changes_with_existing_paths(video_files):
    with patch('os.renames') as mock_renames:
        video_files.parsed_video_files = [
            ('movie_2022_.mp4', 'Movies/movie (2022)/movie_2022_.mp4'),
            ('series_S01E01.mp4', 'Series/series ( - )/Season 1/series_S01E01.mp4'),
            ('multi_word_file_name.mp4', None),
            ('series_S10E10.mp4', 'Series/series ( - )/Season 10/series_S10E10.mp4'),
            ('series_S21E21.mp4', 'Series/series ( - )/Season 21/series_S21E21.mp4'),
            ('invalid_file.mp4', None),
            ('multi_word_file_name_1234.mp4', 'Movies/multi word file name (1234)/multi_word_file_name_1234.mp4')
        ]
        with patch('os.path.exists') as mock_exists:
            mock_exists.return_value = True
            video_files.revert_changes()
            mock_renames.assert_not_called()
            
