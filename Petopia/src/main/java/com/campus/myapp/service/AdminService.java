package com.campus.myapp.service;

import java.util.List;

import com.campus.myapp.vo.AnimalInfoVO;

public interface AdminService {
	public List<AnimalInfoVO> animalInfoList(String searchword);
	
	public int animalInfoInsert(AnimalInfoVO vo);
}
