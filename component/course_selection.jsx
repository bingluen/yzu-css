var CourseSelection = React.createClass({
  getInitialState: function() {

    if(window.location.search.length <= 0) return({ list: [] })
    parameters = {}
    window.location.search.substring(1).split('&').map(function(element) {
      token = element.split('=')
      parameters[token[0]] = token[1]
    })
    if(!parameters.data) return({ list: [] })
    try {
      var data = JSURL.parse(atob(parameters.data))
      return ({ list: data })
    } catch(e) {
      return({ parseError: true, list: [] })
    }

  },
  isConflictCheck: function(list, course) {
    /* 檢查衝堂 */
    for(var i = 0; i < list.length; i++) {
      for(var j = 0; j < list[i].courseTime.length; j++)
      {
        if (course.courseTime.indexOf(list[i].courseTime[j]) >= 0) {

          $('.ui.modal.conflictWarning')
            .modal('show')
          ;
          return true
        }
      }
    }
    return false;
  },
  handleAddCourse: function(course) {
    var list = this.state.list;
    if(!this.isConflictCheck(list, course)) {
      list.push(course);
      this.setState({list: list});
    }
  },
  handleDelete: function(uid) {
    this.setState({
      list: this.state.list.filter(function(element) {
        return element.uid != uid;
      })
    });
  },
  render: function() {
    return (
      <div id="CourseSelection">
        <div className="ui parseError warning message hidden">
          <i className="close icon"></i>
          <div className="header">
            網址解析失敗
          </div>
          <p>無法從網址讀取資料。因此課表將顯示為空白</p>
        </div>
        <div className="ui top attached secondary pointing menu">
          <a className="active item" data-tab="schedule">我的課表</a>
          <a className="item" data-tab="search">Search</a>
          <a className="item" data-tab="about">About</a>
        </div>
        <div className="ui bottom attached tab segment active content" data-tab="schedule">

          <CourseTable courseList={this.state.list} handleDelete={this.handleDelete} />
        </div>
        <div className="ui bottom attached tab segment" data-tab="search">

          <SearchCourse handleAddCourse={this.handleAddCourse}/>
        </div>

        <div className="ui bottom attached tab segment" data-tab="about">
          <div className="header">
            關於
          </div>
          <h4>注意事項</h4>
          <div className="ui bulleted list">
            <div className="item">
              課程資訊僅供參考，實際資訊請參閱
              <a href="https://portal.yzu.edu.tw/cosSelect/Index.aspx">
                元智大學課程查詢系統
              </a>
              。
            </div>
          </div>
          <h4>使用的Framework</h4>
          <div className="ui bulleted list">
            <div className="item">
              React 0.13.3
            </div>
            <div className="item">
              Semantic ui 2.0.8
            </div>
            <div className="item">
              jsurl.js
            </div>
            <div className="item">
              jQuery
            </div>
          </div>
          <h4>原始碼與授權</h4>
          <div className="ui list">
            <div className="ui items">
              <div className="item">
                <div className="ui mini image">
                  <i className="big github icon"></i>
                </div>
                <div className="content">
                  <div className="header">Source code on Github</div>
                  <div className="description">
                    <p>可以由Github上觀看source code</p>
                    <p><a href="https://github.com/erickson-makotoki/yzu-css">https://github.com/erickson-makotoki/yzu-css</a></p>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="ui mini image">
                  <i className="big code icon"></i>
                </div>
                <div className="content">
                  <div className="header">MIT 授權</div>
                  <div className="description">
                    <p>可參閱<a href="http://www.openfoundry.org/tw/licenses/34-mit-licensemit">http://www.openfoundry.org/tw/licenses/34-mit-licensemit</a></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="ui basic modal conflictWarning">
          <i className="close icon"></i>
          <div className="header">
            糟糕，衝堂了
          </div>
          <div className="image content">
            <div className="image">
              <i className="warning circle icon"></i>
            </div>
            <div className="description">
              <p>此課程開課時間，和你已經選的課有重疊喔！</p>
            </div>
          </div>
          <div className="actions">
              <div className="ui green basic inverted button">
                <i className="checkmark icon"></i>
                OK
              </div>
          </div>
        </div>
      </div>
    )
  },
  componentDidMount: function() {
    $('.message.parseError.warning .close')
      .on('click', function() {
        $(this)
          .closest('.message')
          .transition('fade')
        ;
      })
    ;
    if(this.state.parseError)
      $('.message.parseError.warning')
        .show()
      ;
  }
});

var CourseTable = React.createClass({
  getInitialState: function () {
    return({
      day: 6,
      row: 13,
      label: {
        times: [
        '08:10-09:00', '09:10-10:00', '10:10-11:00', '11:10-12:00',
        '12:10-13:00', '13:10-14:00', '14:10-15:00', '15:10-16:00',
        '16:10-17:00', '17:10-18:00', '18:30-19:20', '19:30-20:20',
        '20:30-21:20'
        ],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
    })
  },
  handleDaysChange: function(event) {
    if ( !event ) return false;
    this.setState({day: event});
  },
  handleLessonsChange: function(event) {
    if ( !event ) return false;
    this.setState({row: event});
  },
  handleDelete: function(uid) {
    this.props.handleDelete(uid)
  },
  refreshData: function(courseList) {

    var extendCourse = {}
    courseList.map(function(element) {
      element.courseTime.map(function(value) {
        /* 若課表天數不夠，自動增加 */
        if( Math.floor(value / 100) > this.state.day ) {
          $('.dropdown.daysOption')
            .dropdown('set selected', Math.floor(value / 100))
          ;
        }
        /* 若課表節數不夠，自動增加 */
        if( value % 100 > this.state.row) {
          $('.dropdown.lessonsOption')
            .dropdown('set selected', value % 100)
          ;
        }
        extendCourse[Math.floor(value / 100 - 1).toString()] = extendCourse[Math.floor(value / 100 - 1).toString()] || {}
        extendCourse[Math.floor(value / 100 - 1).toString()][(value % 100 - 1).toString()] = element;
      }.bind(this));
    }.bind(this));
    this.setState({rawData: courseList, extendData: extendCourse});
  },
  componentWillReceiveProps: function(nextProps) {
    this.refreshData(nextProps.courseList);
  },
  componentWillMount: function() {
    this.refreshData(this.props.courseList);
  },
  render: function() {
    var daysOption = [5, 6].map(function(currentValue) {
      return (<option key={currentValue} value={currentValue}>{currentValue}</option>)
    }.bind(this));

    var lessonsOption = [10, 11, 12, 13].map(function(currentValue) {
      return (<option key={currentValue} value={currentValue}>{currentValue}</option>)

    }.bind(this));

    /**
     * prepare table
     *
     */
    var thead;
    var tbody;
    var fields;
    /**
     * prepare thead
     * 先產生childern (Days)
     * 利用unshift補上開頭
     */
    fields = this.state.label.days.map(function(currentValue, index) {
      if(index + 1 > this.state.day) return null;
      return (<th key={index + 1} className="two wide center aligned">{currentValue}</th>)
    }.bind(this));
    fields.unshift(<th key={0} className="two wide" />)
    thead = (<thead><tr key={0}>{fields}</tr></thead>);

    /**
     * prepare tbody
     *
     */

    var rows =this.state.label.times.map(function (currentValue, RowIndex) {

      if(RowIndex + 1 > this.state.row) return null;
      /**
       * 這邊好玄喔....Apply的用法，先產生N個元素的空array
       * 接著透過map針對每個element填入資料
       * 參考自 http://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
       * 最後利用unshift補上時間於row開頭
       */
      fields = Array.apply(null, Array(this.state.day)).map(function(element, index) {
        if(this.state.extendData && this.state.extendData[index.toString()] && this.state.extendData[index.toString()][RowIndex.toString()])
          return (<CourseTableDataField key={index + 1} course={this.state.extendData[index.toString()][RowIndex.toString()]} handleDelete={this.handleDelete} />)
        return (<CourseTableDataField key={index + 1} />)
      }.bind(this))
      fields.unshift(<td key={0} className="center aligned"><p key={0}>第 {RowIndex + 1} 節</p><p key={1}>{currentValue}</p></td>)
      return (<tr key={RowIndex + 1}>{fields}</tr>)

    }.bind(this))

    tbody = (<tbody>{rows}</tbody>)

    return (
      <div>
        <div className="ui form">
          <div className="three fields">
            <div className="field">
              <select defaultValue={this.state.day} className="ui dropdown daysOption">
                {daysOption}
              </select>
              <label>Days per Week</label>
            </div>
            <div className="field">
              <select defaultValue={this.state.row} className="ui dropdown lessonsOption">
                {lessonsOption}
              </select>
              <label>Lessons per Day</label>
            </div>

            <div className="field">
              <div className="teal ui button generatingURL"
                onClick={this.generatingURL}
                data-content="匯出課表，下次可以由該網址繼續編輯。">產生網址</div>
            </div>
          </div>
        </div>


        <table id="CourseTable" className="ui definition table celled">
          {thead}
          {tbody}
        </table>


        <div className="ui modal basic generatingURL">
          <i className="close icon"></i>
          <div className="header">
            產生網址
          </div>
          <div className="ui input fluid">
            <input type="text" ref="url" readOnly />
            <a target="_blank" className="ui teal right labeled icon button" ref="url_button">
              <i className="linkify icon"></i>
              Open
            </a>
          </div>
        </div>
      </div>
    )
  },
  componentDidMount: function() {
    $('.ui.button')
      .popup({
        position: 'bottom center'
      })
    ;
    $('select.dropdown.daysOption')
      .dropdown({
        onChange: this.handleDaysChange
      })
    ;
    $('select.dropdown.lessonsOption')
      .dropdown({
        onChange: this.handleLessonsChange
      })
    ;

  },
  generatingURL: function() {
    var encode = btoa(JSURL.stringify(this.state.rawData))
    React.findDOMNode(this.refs.url).value = window.location.protocol + '//' + window.location.host + window.location.pathname + '?data=' + encode
    React.findDOMNode(this.refs.url_button).href = window.location.protocol + '//' + window.location.host + window.location.pathname + '?data=' + encode
    $('.modal.generatingURL')
      .modal('show')
    ;
  }
});


/**
 * Data Obj format: (column name)
 * course uid
 * Course Code
 * Course Name
 * Teacher Name
 * Time
 */
var CourseTableDataField = React.createClass({
  render: function() {
    if(this.props.course) {
      return(
        <td>
          <div className="right aligned"><a href="#" onClick={this.handleDelete}><i className="close icon"></i></a></div>
          <p className="center aligned">{this.props.course.courseName}<br/>{this.props.course.teacherName}</p>
        </td>
      );
    } else {
      return( <td></td>)
    }
  },
  handleDelete: function() {
    this.props.handleDelete(this.props.course.uid);
  }
});

var SearchCourse = React.createClass({
  getInitialState: function() {
    $.ajax({
      url: 'course_database.json',
      type: 'get',
      dataType: 'json'

    })
    .done(function(data, textStatus, jqXHR) {
      this.setState({courseData: data});
    }.bind(this))
    .fail(function(jqXHR, textStatus, errorThrown) {
    });

    return ( {
      degree: [1, 2, 3, 4],
      reslut: {}
    } )
  },
  handleSearchFormSubmit: function(keys) {
    var result = this.state.courseData.course;

    if(keys.department) {
      result = result.filter(function(element, index, array) {
        return element.department == keys.department;
      });
    }

    if(keys.degree) {
      result = result.filter(function(element, index, array) {
        return element.degree == keys.degree;
      });
    }

    if(keys.courseCode) {
      result = result.filter(function(element, index, array) {
        return element.code.indexOf(keys.courseCode) >= 0;
      });
    }

    if(keys.courseName) {
      result = result.filter(function (element, index, array) {
        return element.chinese_name.indexOf(keys.courseName) >= 0;
      });
    }

    if(keys.teacherName) {
      result = result.filter(function (element, index, array) {
        return element.teacher.indexOf(keys.teacherName) >= 0;
      });
    }

    this.setState({result: result});
  },
  handleCourseAdd: function(course) {
    /**
     * Data Obj format: (column name)
     * course uid
     * Course Code
     * Course Name
     * Teacher Name
     * Time
     */
    this.props.handleAddCourse({
      courseUid:course.uid,
      courseCode:course.code,
      courseName:course.chinese_name,
      teacherName:course.teacher,
      courseTime:course.time.split(',').map(function(element) { return parseInt(element) })
    })
  },
  render: function() {
    if (!this.state.courseData) return null;
    return (
      <div className="ui grid stackable">
        <div className="six wide column">
          <SearchForm degree={this.state.degree}
            department={this.state.courseData.department}
            updateTime={this.state.courseData.update}
            handleSubmit={this.handleSearchFormSubmit} />
        </div>

        <div className="ten wide column searchResult">
          <SearchResult result={this.state.result}
            handleAdd={this.handleCourseAdd} />
        </div>

      </div>
    )
  }
});

var SearchForm = React.createClass({
  getInitialState: function() {
    return({
      department: 0,
      degree: 0
    })
  },
  handleDepartmentChange: function(value) {
    if(value) this.setState({department: value});
  },
  handleGradeChange: function(value) {
    if(value) this.setState({degree: value});
  },
  handleReset: function() {
    $('form').removeClass('error');
    if(this.state.department != 0) {
      $('.dropdown.department')
        .dropdown('restore defaults')
      ;
    }

    if(this.state.degree != 0) {
      $('.dropdown.degree')
        .dropdown('restore defaults')
      ;
    }

  },
  handleSubmit: function(e) {
    $('form').removeClass('error');
    e.preventDefault();
    var keys = {
      department: this.state.department,
      degree: this.state.degree,
      courseCode: (React.findDOMNode(this.refs.courseCode).value.trim() || null),
      courseName: (React.findDOMNode(this.refs.courseName).value.trim() || null),
      teacherName: (React.findDOMNode(this.refs.teacherName).value.trim() || null)
    }

    if( keys.department != 0
       || keys.degree != 0
       || keys.courseCode
       || keys.courseName
       || keys.teacherName)
      this.props.handleSubmit(keys);
    else
      $('form').addClass('error');
  },
  render: function() {
    var Department = this.props.department.map(function(element, index) {
      return (<option key={index + 1} value={element.departmentCode}>{element.departmentName}</option>)
    });
    Department.unshift(<option key={0} value={0}>請選擇 Please Select</option>)

    var Grade = this.props.degree.map(function(element, index) {
      return (<option key={index + 1} value={element}>{element}</option>)
    });
    Grade.unshift(<option key={0} value={0}>請選擇 Please Select</option>)

    return (
      <form className="ui form" onSubmit={this.handleSubmit}>
        <h2 className="ui dividing header">搜尋課程</h2>
          <div className="ui error message">
            <div className="header">缺少搜尋條件</div>
            <p>請至少指定一個搜尋條件，再進行搜尋。</p>
          </div>
          <div className="field">
            <label>開課系所 Department</label>
            <select defaultValue={this.state.department} className="ui dropdown search department">
              {Department}
            </select>
          </div>
          <div className="field">
            <label>選課年級 Grade</label>
            <select defaultValue={this.state.degree} className="ui dropdown degree">
              {Grade}
            </select>
          </div>
          <div className="field">
            <label>課號</label>
            <input type="text" placeholder="Course Code" ref="courseCode" />
          </div>
          <div className="field">
            <label>課程名稱</label>
            <input type="text" placeholder="Course Name" ref="courseName" />
          </div>
          <div className="field">
            <label>開課教師</label>
            <input type="text" placeholder="Teacher Name" ref="teacherName" />
          </div>
          <div className="field">
            <label>資料庫最後更新時間</label>{this.props.updateTime}
          </div>
          <div className="ui buttons right floated">
            <button type="reset" className="ui button reset" onClick={this.handleReset}>Reset</button>
            <div className="or"></div>
            <button type="submit" className="ui positive button">Search</button>
          </div>
      </form>
    )
  },
  componentDidMount: function() {
    $('select.dropdown.department')
      .dropdown({
        onChange: this.handleDepartmentChange
      })
    ;
    $('select.dropdown.degree')
      .dropdown({
        onChange: this.handleGradeChange
      })
    ;
  }
})

var SearchResult = React.createClass({
  handleAdd: function(course) {
    this.props.handleAdd(course);
  },
  render: function() {
    if(!this.props.result) return null;

    if(this.props.result.length > 0) {
      var result = this.props.result.map(function(element, index) {
        return(
          <tr key={index}>
            <td><a href={element.url} target="_blank" className="courseCode" data-content="點選可連結至學校課程系統，觀看課程大綱。">{element.code}</a></td>
            <td>{element.teacher}</td>
            <td>{element.chinese_name}</td>
            <td>{element.credit}</td>
            <td>{element.time}</td>
            <td>{element.degree}</td>
            <td><div className="ui basic olive button" onClick={this.handleAdd.bind(this, element)}>Add</div></td>
          </tr>
        )
      }.bind(this));

      return (
        <div className="ui">
          <h2 className="ui dividing header">搜尋結果</h2>
          <table className="ui striped table">
            <thead>
              <tr>
                <th className="one wide">課號</th>
                <th className="two wide">開課教師</th>
                <th className="three wide">課程名稱</th>
                <th className="one wide">學分</th>
                <th className="one wide">時間</th>
                <th className="one wide">可選年級</th>
                <th className="one wide">Add</th>
              </tr>
            </thead>
            <tbody>
              {result}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className="ui">
          <h2 className="ui dividing header">搜尋結果</h2>
          <div className="warning ui message">
            <div className="header">沒有符合條件的資料</div>
            <ul className="list">
              <li>關鍵字錯誤？（例如在課號中輸入課程名稱）</li>
              <li>嘗試減少關鍵字，改用系所和年級查詢</li>
            </ul>
          </div>
        </div>
      )
    }

  },
  componentDidUpdate: function() {
    $('.courseCode')
      .popup({
        position: 'bottom center'
      })
    ;
  }
});

$(document).ready(function() {
  $('.menu .item')
    .tab()
  ;
});
